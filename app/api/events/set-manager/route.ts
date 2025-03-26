import { NextResponse } from "next/server";
import { FirebaseError } from "firebase/app";
import { adminFirebaseAuth, adminFirebaseDB } from "lib/firebase/admin";
import { handleGetUserByEmailError } from "utils/handleGetUserByEmailError";
import { FieldValue } from "firebase-admin/firestore";
import { EventManager } from "@/types/Events";

export async function POST(request: Request) {
  const { eventId, managerEmail } = await request.json();

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
    // 1 - check if calling user is an admin
    const decodedToken = await adminFirebaseAuth.verifyIdToken(authToken);
    if (!decodedToken.role || !decodedToken.role.admin) {
      return NextResponse.json(
        { message: "Non autorisé : Accès administrateur requis." },
        { status: 403 }
      );
    }

    // 2 - check if the user who will become Manager exists (else the error will be caught in catch bloc)
    const managerInfos = await adminFirebaseAuth.getUserByEmail(managerEmail);

    // 3 - check if event exists and is not already finished
    const eventDoc = await adminFirebaseDB
      .collection("events")
      .doc(eventId)
      .get();
    if (!eventDoc.exists) {
      return NextResponse.json(
        { message: `L'événement ayant l'id: ${eventId} n'a pas été trouvé.` },
        { status: 404 }
      );
    } else if (eventDoc.data()?.endDate.toMillis() < new Date().getTime()) {
      return NextResponse.json(
        { message: `L'événement: ${eventDoc.data()?.name} est déjà passé.` },
        { status: 401 }
      );
    }

    // set the manager of event
    const managerDataToStore: EventManager = {
      uid: managerInfos.uid,
      email: managerEmail,
      displayName: managerInfos.displayName || "",
      ticketsSoldCount: 0,
      controlledTicketsCount: 0,
      totalTicketsGenerated: 0,
    };
    await adminFirebaseDB
      .collection("events")
      .doc(eventId)
      .update({
        manager: {
          ...managerDataToStore,
        },
        updatedAt: FieldValue.serverTimestamp(),
      });

    return NextResponse.json(
      {
        success: true,
        message: `${
          managerInfos.displayName
        } est maintenant le manager de l'événement: ${eventDoc.data()?.name}.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Erreur lors de la définition du manager:", error);

    let errorMessage = "";
    if (error instanceof Error) {
      if ("code" in error)
        errorMessage = handleGetUserByEmailError(error as FirebaseError);
      else errorMessage = error.message;
    }

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
