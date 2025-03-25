import { or, where } from "firebase/firestore";

export const getQueryUserEventsAllowed = (
  currentUserIsAdmin: boolean,
  currentUserUid: string
) => {
  const queryConstraints = [];
  if (!currentUserIsAdmin) {
    queryConstraints.push(
      or(
        where("manager.uid", "==", currentUserUid),
        where("memberUids", "array-contains", currentUserUid)
      )
    );
  }
  return queryConstraints;
};

export const getQueryUserInvitationsAllowed = (
  currentUserIsAdmin: boolean,
  currentUserUid: string
) => {
  const queryConstraints = [];

  if (!currentUserIsAdmin) {
    queryConstraints.push(
      or(
        where("invitee.uid", "==", currentUserUid),
        where("invitedBy.uid", "==", currentUserUid)
      )
    );
  }

  return queryConstraints;
};
