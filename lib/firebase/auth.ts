import { firebaseAuth } from "@/lib/firebase/client";
import { updateProfile } from "firebase/auth";

// update user profile
export const updateUserProfile = async (
  displayName?: string,
  photoURL?: string
) => {
  // to preserve old values if not provided
  const updates: { displayName?: string; photoURL?: string } = {};
  if (displayName) updates.displayName = displayName;
  if (photoURL) updates.photoURL = photoURL;

  try {
    if (firebaseAuth.currentUser) {
      await updateProfile(firebaseAuth.currentUser, updates);
      return { success: true };
    } else {
      return { success: false, error: "Vous devez être connecté." };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur est survenue, veuillez réessayer.";

    return { success: false, error: errorMessage };
  }
};
