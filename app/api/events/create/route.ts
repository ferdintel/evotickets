import { FirebaseAppError } from "firebase-admin/app";
import { adminFirebaseDB } from "lib/firebase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const eventData = await request.json();

  // check if calling user is an admin

  // check if event data is valid

  // create new event
  try {
    const docRef = await adminFirebaseDB.collection("events").add(eventData);
    NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof FirebaseAppError) {
      NextResponse.json(
        { sucess: false, message: "Une erreur est survenue: " + error.message },
        { status: 500 }
      );
    } else {
      console.log("Erreur interne", error);
      NextResponse.json(
        { sucess: false, message: "Erreur interne" },
        { status: 500 }
      );
    }
  }
}
