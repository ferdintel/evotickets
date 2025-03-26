import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { adminFirebaseAuth, adminFirebaseDB } from "lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { EventDataType } from "@/types/Events";
import { FirebaseError } from "firebase/app";
import { handleGetUserByEmailError } from "@/utils/handleGetUserByEmailError";

import {
  DefaultCurrencies,
  ETicketStatus,
  ETicketType,
  StoreTicketsDataType,
} from "@/types/Tickets";

export async function POST(request: Request) {
  const { eventId, ticketCount, ticketCategory, ticketPrice, ticketType } =
    await request.json();

  // to get authToken of calling user
  const authorization = request.headers.get("Authorization");
  const authToken = authorization?.startsWith("Bearer ")
    ? authorization.split("Bearer ")[1]
    : null;

  if (!authToken) {
    return NextResponse.json(
      { message: "Non autorisé : Token d'autorisation manquant." },
      { status: 401 }
    );
  }

  try {
    // 1 - check if calling user has an admin role or is the manager of event
    const decodedToken = await adminFirebaseAuth.verifyIdToken(authToken);
    const callingUser = await adminFirebaseAuth.getUserByEmail(
      decodedToken.email as string
    );

    // 1.1 - check if event doc exists and is not already finished
    const eventDocRef = adminFirebaseDB.collection("events").doc(eventId);
    const eventDoc = await eventDocRef.get();
    const eventData = eventDoc.data() as EventDataType;

    if (!eventDoc.exists) {
      return NextResponse.json(
        { message: `L'événement ayant l'id: ${eventId} n'a pas été trouvé.` },
        { status: 404 }
      );
    } else if (eventDoc.data()?.endDate.toMillis() < new Date().getTime()) {
      return NextResponse.json(
        { message: `L'événement: ${eventData.name} est déjà passé.` },
        { status: 401 }
      );
    }

    // 1.2 - check if calling user has an admin role or is the manager of event
    const isAdmin = decodedToken.role && decodedToken.role.admin;
    const isEventManager = callingUser.email === eventData?.manager?.email;
    if (!isAdmin && !isEventManager) {
      return NextResponse.json(
        {
          message:
            "Non autorisé : Seul un administrateur ou le manager de l'événement peut inviter un membre.",
        },
        { status: 403 }
      );
    }

    // 2. check if ticketCount is valid
    if (typeof ticketCount !== "number" || ticketCount <= 0) {
      return NextResponse.json(
        { message: "Le nombre de billets doit être un nombre positif." },
        { status: 400 }
      );
    }

    // 3. check if ticketPrice is valid
    if (typeof ticketPrice.value !== "number" || ticketPrice.value <= 0) {
      return NextResponse.json(
        { message: "Le prix du billet doit être un nombre positif." },
        { status: 400 }
      );
    }
    if (!Object.values(DefaultCurrencies).includes(ticketPrice.currency)) {
      return NextResponse.json(
        {
          message: `La devise "${
            ticketPrice.currency
          }" est invalide. Valeurs autorisées : ${Object.values(
            DefaultCurrencies
          ).join(", ")}.`,
        },
        { status: 400 }
      );
    }

    // 4. check if ticketType is valid
    if (!Object.values(ETicketType).includes(ticketType)) {
      return NextResponse.json(
        {
          message: `Le type de billet "${ticketType}" est invalide. Valeurs autoriseés : ${Object.values(
            ETicketType
          ).join(", ")}.`,
        },
        { status: 400 }
      );
    }

    // generate the tickets
    const ticketsToCreate: StoreTicketsDataType[] = [];
    for (let i = 0; i < ticketCount; i++) {
      const ticketCode = `${randomUUID()}`;
      const ticketData: StoreTicketsDataType = {
        eventId,
        managerUid: eventData.manager?.uid || null,
        code: ticketCode,
        category: ticketCategory,
        price: { ...ticketPrice },
        status: ETicketStatus.VALID,
        type: ticketType,
        assignedTo: null,
      };
      ticketsToCreate.push(ticketData);
    }

    // store the generated tickets in firestore
    const batch = adminFirebaseDB.batch();
    ticketsToCreate.forEach((ticket) => {
      const ticketRef = adminFirebaseDB.collection("tickets").doc();
      batch.set(ticketRef, ticket);
    });

    await batch.commit();

    await eventDocRef.update({
      ticketCategory: FieldValue.arrayUnion(ticketCategory),
      // update totalExpected in current devise
      [`revenueStats.totalExpected.${ticketPrice.currency.toLowerCase()}`]:
        FieldValue.increment(parseFloat(ticketPrice.value) * ticketCount),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        success: true,
        message: `${ticketCount} billets générés avec succès!`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Erreur lors de la génération des billets:", error);

    let errorMessage = "";
    if (error instanceof Error) {
      if ("code" in error)
        errorMessage = handleGetUserByEmailError(error as FirebaseError);
      else errorMessage = error.message;
    }

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
