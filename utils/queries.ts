import { where } from "firebase/firestore";

export const getQueryUSerEventsAllowed = (
  currentUserIsAdmin: boolean,
  currentUserEmail: string
) => {
  const queryConstraints = [];
  if (!currentUserIsAdmin) {
    queryConstraints.push(where("managerEmail", "==", currentUserEmail));
  }
  return queryConstraints;
};
