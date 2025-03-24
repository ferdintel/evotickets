import { FirebaseError } from "firebase/app";

export const handleGetUserByEmailError = (error: FirebaseError) => {
  switch (error.code) {
    case "auth/invalid-email":
    case "auth/user-not-found":
      return "L'utilisateur spécifié n'existe pas, veuillez vérifier l'adresse email indiquée.";
    case "auth/too-many-requests":
      return "Trop de tentatives, veuillez réessayer plus tard.";
    case "auth/network-request-failed":
      return "Une erreur est survenue, vérifiez votre connexion internet.";
    default:
      return error.message;
  }
};
