import { NextResponse } from "next/server";
import { adminFirebaseAuth } from "lib/firebase/admin";
import { FirebaseAppError } from "firebase-admin/app";

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
    if (error instanceof FirebaseAppError) {
      return NextResponse.json(
        {
          sucess: false,
          message: "Erreur lors de l'attribution du rôle: " + error.message,
        },
        { status: 500 }
      );
    } else {
      console.log("Erreur lors de l'attribution du rôle:", error);
      return NextResponse.json(
        { sucess: false, message: "Erreur lors de l'attribution du rôle" },
        { status: 500 }
      );
    }
  }
}
