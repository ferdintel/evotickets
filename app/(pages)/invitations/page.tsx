"use client";

import toast from "react-hot-toast";
import Button from "@/components/Button";
import ProtectedLayout from "@/components/ProtectedLayout";
import FetchDataErrorDisplay from "@/components/FetchDataErrorDisplay";

import useDocsFromFirestore from "@/hooks/useDocsFromFirestore";

import { useAppSelector } from "@/lib/store/hooks";
import { selectAuth } from "@/lib/store/slices/authSlice";
import { getQueryUserInvitationsAllowed } from "@/utils/queries";
import { QueryConstraint } from "firebase/firestore";
import { firebaseAuth } from "@/lib/firebase/client";
import { FirebaseError } from "firebase/app";

import {
  eventMemberRoleInFrench,
  InvitationDataType,
  InvitationStatus,
  invitationStatusInFrench,
} from "@/types/Events";

import { BiLoaderCircle } from "react-icons/bi";
import { FaUserFriends } from "react-icons/fa";
import { LuCheck, LuX } from "react-icons/lu";
import { useState } from "react";

const Invitations = () => {
  const { currentUser } = useAppSelector(selectAuth);

  // to get all invitations associated with the current user
  const queryConstraints = getQueryUserInvitationsAllowed(
    currentUser?.isAdmin as boolean,
    currentUser?.uid as string
  );

  const { docs, isLoading, error } = useDocsFromFirestore<InvitationDataType>(
    "invitations",
    queryConstraints as unknown as QueryConstraint[]
  );

  //   to filter invitation
  const sentInvitations = docs.filter(
    (invitation) => invitation.invitedBy.uid === currentUser?.uid
  );
  const receivedInvitations = docs.filter(
    (invitation) => invitation.invitee.uid === currentUser?.uid
  );

  // to accept or reject invitation
  const [replyIsLoading, setReplyIsLoading] = useState(false);
  const [invitationConcerned, setInvitationConcerned] = useState("");
  const replyToInvitation = async (
    invitationId: string,
    invitationStatus: InvitationStatus.ACCEPTED | InvitationStatus.REJECTED
  ) => {
    try {
      setReplyIsLoading(true);

      const authToken = await firebaseAuth.currentUser?.getIdToken();
      const response = await fetch("/api/invitations/reply", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ invitationId, invitationStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof FirebaseError || error instanceof Error
          ? error.message
          : "Une erreur est survenue, veuillez réessayer.";

      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setReplyIsLoading(false);
      setInvitationConcerned("");
    }
  };

  return (
    <ProtectedLayout>
      <main className="mb-8 flex flex-col gap-y-8">
        {/* header */}
        <div
          className="py-6 -mx-4 mobileM:-mx-5 px-4 mobileM:px-5 bg-white border-b border-gray-300
          flex items-center justify-between"
        >
          {/* title */}
          <div className="flex flex-col gap-y-1">
            <h1 className="text-xl font-semibold">Événements</h1>
            <p className="text-foreground/80 font-medium">
              Liste des invitations ({docs.length})
            </p>
          </div>
        </div>

        {/* when an error has occurred */}
        {error && <FetchDataErrorDisplay msg={error.message} />}

        {/* is loading */}
        {!error && isLoading && (
          <p className="flex items-center justify-center text-center font-medium gap-x-4">
            Chargement des invitations
            <span className="animate-spin text-alternate">
              <BiLoaderCircle size={20} />
            </span>
          </p>
        )}

        {/* sucess case */}
        {!error && !isLoading && docs.length === 0 ? (
          // invitations list is empty
          <div className="mt-4 flex flex-col items-center text-center gap-y-2">
            <span className="w-28 h-28 flex items-center justify-center rounded-[2rem] bg-gray-200 border border-gray-300">
              <FaUserFriends
                size={48}
                className="min-w-12 text-foreground/60"
              />
            </span>

            <p className="text-lg font-semibold">
              Vous n&apos;avez aucune invitation
            </p>
            <p className="text-foreground/80 text-sm font-medium">
              La liste de vos invitations sera affichée ici.
            </p>
          </div>
        ) : (
          //  invitation list is filled
          !error &&
          !isLoading &&
          docs.length > 0 && (
            <div className="flex gap-x-8">
              {/* invitations sent */}
              <div className="w-full flex flex-col gap-y-4 bg-white rounded-lg border border-gray-300 p-4">
                {/* header */}
                <div className="-mx-4 pb-4 px-4 border-b border-gray-300">
                  <h3 className="font-semibold">
                    Invitations envoyées ({sentInvitations.length})
                  </h3>
                </div>

                {/* invitations */}
                <ul className="flex flex-col gap-y-4">
                  {sentInvitations.length > 0 ? (
                    sentInvitations.map((invitation) => (
                      <li
                        key={invitation.id}
                        className="flex items-center gap-x-3 justify-between"
                      >
                        <span className="text-sm font-semibold">
                          {invitation.invitee.displayName}
                        </span>

                        <span className="text-sm text-foreground/80">
                          {invitation.invitee.email}
                        </span>

                        <span className="text-sm text-foreground/80">
                          {invitation.createdAt.toDate().toLocaleString()}
                        </span>

                        <span className="text-sm text-foreground/80">
                          {eventMemberRoleInFrench[invitation.invitee.role]}
                        </span>

                        <span
                          className={`font-semibold px-2 py-[6px] rounded-md text-sm ${
                            invitation.status === InvitationStatus.PENDING
                              ? "bg-gray-200 text-gray-600"
                              : invitation.status === InvitationStatus.ACCEPTED
                              ? "bg-green-200 text-green-600"
                              : "bg-red-200 text-red-600"
                          }`}
                        >
                          {invitationStatusInFrench[invitation.status]}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">
                      Aucune invitation envoyée.
                    </li>
                  )}
                </ul>
              </div>

              {/* invitations received */}
              <div className="w-full flex flex-col gap-y-4 bg-white rounded-lg border border-gray-300 p-4">
                {/* header */}
                <div className="-mx-4 pb-4 px-4 border-b border-gray-300">
                  <h3 className="font-semibold">
                    Invitations reçues ({receivedInvitations.length})
                  </h3>
                </div>

                {/* invitations */}
                <ul className="flex flex-col gap-y-4">
                  {receivedInvitations.length > 0 ? (
                    receivedInvitations.map((invitation) => (
                      <li
                        key={invitation.id}
                        className="flex items-center gap-x-3 justify-between"
                      >
                        <span className="text-sm font-semibold">
                          {invitation.invitedBy.displayName}
                        </span>

                        <span className="text-sm text-foreground/80">
                          {invitation.invitedBy.email}
                        </span>

                        <span className="text-sm text-foreground/80">
                          {invitation.createdAt.toDate().toLocaleString()}
                        </span>

                        <span className="text-sm text-foreground/80">
                          {eventMemberRoleInFrench[invitation.invitee.role]}
                        </span>

                        {/* status */}
                        {invitation.status === InvitationStatus.PENDING ? (
                          <div className="flex items-center gap-x-2">
                            <Button
                              size="small"
                              variant="primary"
                              title="Accepter"
                              addStyles="flex justify-center items-center gap-x-1"
                              disabled={replyIsLoading}
                              isLoading={
                                replyIsLoading &&
                                invitationConcerned === invitation.id
                              }
                              onClick={() => {
                                setInvitationConcerned(invitation.id);
                                replyToInvitation(
                                  invitation.id,
                                  InvitationStatus.ACCEPTED
                                );
                              }}
                            >
                              {!replyIsLoading && invitationConcerned!==invitation.id && (
                                <LuCheck
                                  size={16}
                                  strokeWidth={3}
                                  className="text-white"
                                />
                              )}
                            </Button>

                            <Button
                              size="small"
                              variant="secondary"
                              title="Refuser"
                              addStyles="flex justify-center items-center gap-x-1"
                              disabled={replyIsLoading}
                              isLoading={
                                replyIsLoading &&
                                invitationConcerned === invitation.id
                              }
                              onClick={() => {
                                setInvitationConcerned(invitation.id);
                                replyToInvitation(
                                  invitation.id,
                                  InvitationStatus.REJECTED
                                );
                              }}
                            >
                              {!replyIsLoading && invitationConcerned!==invitation.id && (
                                <LuX
                                  size={16}
                                  strokeWidth={3}
                                  className="text-foreground/80"
                                />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <p
                            className={`font-semibold px-2 py-[6px] rounded-md text-sm ${
                              invitation.status === InvitationStatus.ACCEPTED
                                ? "bg-green-200 text-green-600"
                                : "bg-red-200 text-red-600"
                            }`}
                          >
                            {invitationStatusInFrench[invitation.status]}
                          </p>
                        )}
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">Aucune invitation reçue.</p>
                  )}
                </ul>
              </div>
            </div>
          )
        )}
      </main>
    </ProtectedLayout>
  );
};

export default Invitations;
