import "server-only";

import { NextResponse } from "next/server";
import { firebaseAuth } from "lib/firebase/client";
import { adminFirebaseAuth } from "lib/firebase/admin";
import { FirebaseAppError } from "firebase-admin/app";

export async function POST(request: Request) {
  const { targetedUserEmail } = await request.json();

  try {
    // check if calling user is an admin
    // const callingUser = firebaseAuth.currentUser?.email;
    // console.log("callingUser", callingUser);

    // if calling user is not an admin, return an error
    // if (!callingUserIsAdmin) {
    //   return NextResponse.json(
    //     { message: "Vous n'êtes pas autorisé à effectué cette action" },
    //     { status: 401 }
    //   );
    // }

    const targetedUser = await adminFirebaseAuth.getUserByEmail(
      targetedUserEmail
    );

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
