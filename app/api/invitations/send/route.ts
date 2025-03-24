import { NextResponse } from "next/server";
import { adminFirebaseAuth, adminFirebaseDB } from "lib/firebase/admin";

import {
  EventDataType,
  EventMemberRole,
  InvitationStatus,
  StoreInvitationDataType,
} from "@/types/Events";

import { FieldValue } from "firebase-admin/firestore";
import { handleGetUserByEmailError } from "@/utils/handleGetUserByEmailError";
import { FirebaseError } from "firebase/app";
import { Timestamp } from "firebase/firestore";

export async function POST(request: Request) {
  const { eventId, memberEmail, memberRole } = await request.json();

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

    // 2 - check if user to invite exists and it's not the manager himself
    const inviteeInfos = await adminFirebaseAuth.getUserByEmail(memberEmail);
    if (
      memberEmail === eventData?.manager?.email &&
      memberEmail !== callingUser.email
    ) {
      return NextResponse.json(
        // when admin send the invitation
        {
          message:
            "Vous ne pouvez pas inviter le manager de l'événement à devenir membre.",
        },
        { status: 400 }
      );
    }

    if (memberEmail === callingUser.email) {
      return NextResponse.json(
        // when manager send the invitation
        { message: "Vous ne pouvez pas vous inviter vous-même." },
        { status: 400 }
      );
    }

    // 3 - check if role value is correct
    if (!Object.values(EventMemberRole).includes(memberRole)) {
      return NextResponse.json(
        {
          message: `Le rôle ${memberRole} est invalide. Valeurs autorisées : "VENDOR" ou "CONTROLLER".`,
        },
        { status: 400 }
      );
    }

    // 4 - check if invitation already exists
    const existingInvitation = await adminFirebaseDB
      .collection("invitations")
      .where("eventId", "==", eventId)
      .where("invitee.uid", "==", inviteeInfos.uid)
      .where("status", "==", InvitationStatus.PENDING)
      .limit(1)
      .get();

    if (!existingInvitation.empty) {
      return NextResponse.json(
        {
          message: `Une invitation en attente existe déjà pour ${inviteeInfos.displayName} sur cet événement.`,
        },
        { status: 409 }
      );
    }

    // data to store
    const invitationData: StoreInvitationDataType = {
      eventId,
      invitee: {
        uid: inviteeInfos.uid,
        email: inviteeInfos.email as string,
        displayName: inviteeInfos.displayName as string,
        role: memberRole,
      },
      invitedBy: {
        uid: callingUser.uid,
        email: callingUser.email as string,
        displayName: callingUser.displayName as string,
      },
      status: InvitationStatus.PENDING,
      createdAt: FieldValue.serverTimestamp() as Timestamp,
      updatedAt: FieldValue.serverTimestamp() as Timestamp,
    };

    // save  to firestore
    await adminFirebaseDB.collection("invitations").add(invitationData);

    return NextResponse.json(
      {
        success: true,
        message: `Invitation pour l'événement ${eventData.name} a été envoyée avec succès à ${inviteeInfos.displayName} !`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Erreur lors de l'envoie de l'invitation:", error);

    let errorMessage = "";
    if (error instanceof Error) {
      if ("code" in error)
        errorMessage = handleGetUserByEmailError(error as FirebaseError);
      else errorMessage = error.message;
    }

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
