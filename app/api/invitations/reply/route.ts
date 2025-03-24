import { NextResponse } from "next/server";
import { adminFirebaseAuth, adminFirebaseDB } from "lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import {
  InvitationDataType,
  InvitationStatus,
  invitationStatusInFrench,
} from "@/types/Events";
import { handleGetUserByEmailError } from "@/utils/handleGetUserByEmailError";
import { FirebaseError } from "firebase/app";

export async function PATCH(request: Request) {
  const { invitationId, invitationStatus } = await request.json();

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
    // 1 - get infos about calling user
    const decodedToken = await adminFirebaseAuth.verifyIdToken(authToken);
    const callingUser = await adminFirebaseAuth.getUserByEmail(
      decodedToken.email as string
    );

    // 2. check if invitation exists and is pending
    const invitationRef = adminFirebaseDB
      .collection("invitations")
      .doc(invitationId);
    const invitationDoc = await invitationRef.get();

    if (!invitationDoc.exists) {
      return NextResponse.json(
        { message: "Invitation non-trouvée" },
        { status: 404 }
      );
    }

    const invitation = invitationDoc.data() as InvitationDataType;
    if (invitation?.status !== InvitationStatus.PENDING) {
      return NextResponse.json(
        {
          message: `L'invitation a déjà été: ${invitationStatusInFrench[
            invitation.status
          ].toLocaleLowerCase()}. Envoyez en une nouvelle.`,
        },
        { status: 400 }
      );
    }

    // 3. check if current user is the invitee
    if (invitation.invitee.uid !== callingUser.uid) {
      return NextResponse.json(
        { message: "Seul l'utilisateur invité peut répondre." },
        { status: 403 }
      );
    }

    // 4. validate new status (accepted or rejected)
    if (
      invitationStatus !== InvitationStatus.ACCEPTED &&
      invitationStatus !== InvitationStatus.REJECTED
    ) {
      return NextResponse.json(
        {
          message: `La valeur du status de l'invitation : "${invitationStatus}" est incorrecte. Vous ne pouvez que "accepter" ou "réfuser".`,
        },
        { status: 400 }
      );
    }

    // 5. update invitation status
    await invitationRef.update({
      status: invitationStatus,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 6. add user to event members if status = ACCEPTED
    if (invitationStatus === InvitationStatus.ACCEPTED) {
      const memberRef = adminFirebaseDB
        .collection("events")
        .doc(invitation.eventId)
        .collection("members")
        .doc(invitation.invitee.uid);

      await memberRef.set(
        {
          email: invitation.invitee.email,
          displayName: invitation.invitee.displayName,
          role: invitation.invitee.role,
        },
        { merge: true }
      );
    }

    // for response
    const updatedInvitationDoc = await invitationRef.get();
    const updatedInvitation = updatedInvitationDoc.data() as InvitationDataType;

    return NextResponse.json(
      {
        success: true,
        message: `Invitation  ${invitationStatusInFrench[
          updatedInvitation.status
        ].toLocaleLowerCase()}.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Erreur lors de la réponse à une invitation:", error);

    let errorMessage = "";
    if (error instanceof Error) {
      if ("code" in error)
        errorMessage = handleGetUserByEmailError(error as FirebaseError);
      else errorMessage = error.message;
    }

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
