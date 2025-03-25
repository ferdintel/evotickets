import toast from "react-hot-toast";

import { FirebaseError } from "firebase/app";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebaseStorage } from "./client";

export const uploadEventCoverToCloudStorage = async (imageFile: File) => {
  const fileName = new Date().getTime();

  try {
    const eventCoversRef = ref(firebaseStorage, `eventCovers/${fileName}`);
    const snapshot = await uploadBytes(eventCoversRef, imageFile);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    const errorMessage =
      error instanceof FirebaseError || error instanceof Error
        ? "Une erreur est survenue lors de l'envoie de l'mage de couverture: " +
          error.message
        : "Une erreur est survenue lors de l'envoie de l'image de couverture, veuillez réessayer.";

    toast.error(errorMessage, {
      duration: 5000,
    });
  }
};
