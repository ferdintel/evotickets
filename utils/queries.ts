import { and, or, where } from "firebase/firestore";
import { useAppSelector } from "@/lib/store/hooks";
import { selectAuth } from "@/lib/store/slices/authSlice";
import { selectCurrentEvent } from "@/lib/store/slices/currentEventSlice";

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

export const getQueryUserTicketsAllowed = () => {
  const { currentUserIsAdmin, currentUserUid } = getCurrentUserInfos();
  const currentEvent = useAppSelector(selectCurrentEvent);

  const baseFilters = [where("eventId", "==", currentEvent?.id)];

  if (!currentUserIsAdmin) {
    const userFilters = or(
      where("managerUid", "==", currentUserUid),
      where("assignedTo.uid", "==", currentUserUid)
    );
    return [and(...baseFilters, userFilters)];
  }

  return baseFilters;
};
