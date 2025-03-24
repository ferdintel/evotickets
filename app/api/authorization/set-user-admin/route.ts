import { NextResponse } from "next/server";
import { adminFirebaseAuth } from "lib/firebase/admin";
import { FirebaseAppError } from "firebase-admin/app";
import { handleGetUserByEmailError } from "@/utils/handleGetUserByEmailError";
import { FirebaseError } from "firebase/app";

export async function POST(request: Request) {
  const { targetedUserEmail } = await request.json();

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

    // 2 - check if the user who will become Administrator exists (else the error will be caught in catch bloc)
    const targetedUser = await adminFirebaseAuth.getUserByEmail(
      targetedUserEmail
    );

    // 3 - set the user administrator
    await adminFirebaseAuth.setCustomUserClaims(targetedUser.uid, {
      role: { admin: true },
    });

    return NextResponse.json(
      {
        success: true,
        message: `L'utilisateur: ${targetedUser.email} est maintenant un administrateur`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Erreur lors de l'attribution du rôle d'administrateur:", error);

    let errorMessage = "";
    if (error instanceof Error) {
      if ("code" in error)
        errorMessage = handleGetUserByEmailError(error as FirebaseError);
      else errorMessage = error.message;
    }

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
