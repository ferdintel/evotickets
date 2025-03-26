"use client";

import Button from "components/Button";

import { useAppSelector } from "@/lib/store/hooks";
import { selectAuth } from "@/lib/store/slices/authSlice";
import { selectCurrentEvent } from "@/lib/store/slices/currentEventSlice";
import { BiLoaderCircle } from "react-icons/bi";

type ManagerAccessWrapperProps = {
  children: React.ReactNode;
};

const ManagerAccessWrapper = ({ children }: ManagerAccessWrapperProps) => {
  const auth = useAppSelector(selectAuth);
  const currentEvent = useAppSelector(selectCurrentEvent);

  return (
    <>
      {auth.pending && (
        <p className="flex items-center justify-center text-center font-medium gap-x-4">
          Veuillez patienter
          <span className="animate-spin text-alternate">
            <BiLoaderCircle size={20} />
          </span>
        </p>
      )}

      {!auth.pending &&
        !auth.currentUser?.isAdmin &&
        auth.currentUser?.uid !== currentEvent?.manager?.uid && (
          <div className="flex flex-col items-center text-center gap-y-4">
            <p className="font-semibold">
              Accès réservé au manager
            </p>

            <Button link={`/events/${currentEvent?.id}`}>
              Retour
            </Button>
          </div>
        )}

      {!auth.pending &&
        (auth.currentUser?.isAdmin ||
          auth.currentUser?.uid === currentEvent?.manager?.uid) && (
          <> {children}</>
        )}
    </>
  );
};

export default ManagerAccessWrapper;
