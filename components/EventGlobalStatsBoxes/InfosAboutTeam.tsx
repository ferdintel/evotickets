"use client";

import InviteMemberDialog from "components/InviteMemberDialog";
import SetManagerDialog from "components/SetManagerDialog";
import Button from "components/Button";

import { useParams } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { selectAuth } from "@/lib/store/slices/authSlice";
import { selectCurrentEvent } from "@/lib/store/slices/currentEventSlice";
import { EventMemberRole } from "@/types/Events";

const InfosAboutTeam = () => {
  const eventId = useParams<{ id: string }>()?.id;
  const { currentUser } = useAppSelector(selectAuth);
  const currentEvent = useAppSelector(selectCurrentEvent);

  const isAdminOrEventManage = () =>
    currentUser?.isAdmin || currentUser?.uid === currentEvent?.manager?.uid;

  return (
    <div className="w-full flex flex-col gap-y-4 bg-white rounded-lg border border-gray-300 p-4">
      {/* header */}
      <div className="-mx-4 pb-4 px-4 flex items-center justify-between border-b border-gray-300">
        <h3 className="font-semibold">Votre équipe en chiffre</h3>

        {isAdminOrEventManage() && (
          <Button
            link={`/events/${eventId}/team`}
            variant="secondary"
            size="small"
          >
            Détails
          </Button>
        )}
      </div>

      {/* body */}
      <div className="grow flex flex-col gap-y-3">
        {/* set the event manager or display its email */}
        <div className="flex items-center justify-between">
          <p className="text-foreground/80">Manager</p>
          {currentEvent?.manager?.email ? (
            <p className="font-semibold">
              {currentEvent.manager.uid === currentUser?.uid
                ? "Vous"
                : currentEvent.manager.displayName +
                  " · " +
                  currentEvent.manager.email}
            </p>
          ) : (
            <SetManagerDialog />
          )}
        </div>

        {/* count vendors & controllers */}
        <div className="-mx-4 pb-4 px-4 flex flex-col gap-y-2 border-b border-gray-300">
          <p className="flex items-center justify-between">
            <span className="text-foreground/80">Vendeurs</span>
            <span className="font-semibold">
              {
                Object.values(currentEvent?.members || {}).filter(
                  (member) => member.role === EventMemberRole.VENDOR
                ).length
              }
            </span>
          </p>

          <p className="flex items-center justify-between">
            <span className="text-foreground/80">Contrôleurs</span>
            <span className="font-semibold">
              {
                Object.values(currentEvent?.members || {}).filter(
                  (member) => member.role === EventMemberRole.CONTROLLER
                ).length
              }
            </span>
          </p>
        </div>

        {/* for only admins and event manager */}
        {isAdminOrEventManage() && (
          <div className="grow flex justify-center items-center">
            {/* button to add a user to your team */}
            <InviteMemberDialog />
          </div>
        )}
      </div>
    </div>
  );
};

export default InfosAboutTeam;
