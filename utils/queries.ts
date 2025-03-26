import { or, where } from "firebase/firestore";
import { useAppSelector } from "@/lib/store/hooks";
import { selectAuth } from "@/lib/store/slices/authSlice";

const getCurrentUserInfos = () => {
  const { currentUser } = useAppSelector(selectAuth);
  const currentUserIsAdmin = currentUser?.isAdmin;
  const currentUserUid = currentUser?.uid;
  return { currentUserIsAdmin, currentUserUid };
};

export const getQueryUserEventsAllowed = () => {
  const { currentUserIsAdmin, currentUserUid } = getCurrentUserInfos();
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

export const getQueryUserInvitationsAllowed = () => {
  const { currentUserIsAdmin, currentUserUid } = getCurrentUserInfos();
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
