import { collection, doc } from "firebase/firestore";
import { firebaseDB } from "lib/firebase/client";

export const eventCollectionRef = collection(firebaseDB, "events");
export const eventDocRef = (docId: string) => doc(eventCollectionRef, docId);
export const invitationCollectionRef = collection(firebaseDB, "invitations");
export const ticketsCollectionRef = collection(firebaseDB, "tickets");
