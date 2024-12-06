import toast from "react-hot-toast";
import { firebaseStorage } from ".";
import { FirebaseError } from "firebase/app";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadEventCoverToCloudStorage = async (imageFile: File) => {
  const fileName = new Date().getTime();

  try {
    const eventCoversRef = ref(firebaseStorage, `event_covers/${fileName}`);
    const snapshot = await uploadBytes(eventCoversRef, imageFile);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (err) {
    if (err instanceof FirebaseError) {
      toast.error(
        `Une erreur est survenue lors de l'envoie de l'mage de couverture: ${err.message}`
      );
    }
  }
};
