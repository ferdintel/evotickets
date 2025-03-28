"use client";

import Button from "components/Button";
import ManagerAccessWrapper from "@/components/ManagerAccessWrapper";
import TicketsAttributionDialog from "@/components/TicketsAttributionDialog";

import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentEvent } from "@/lib/store/slices/currentEventSlice";
import { EventMemberRole, eventMemberRoleInFrench } from "@/types/Events";

import { RiDeleteBinLine } from "react-icons/ri";

const EventTeam = () => {
  const currentEvent = useAppSelector(selectCurrentEvent);

  return (
    <ManagerAccessWrapper>
      <div className="flex flex-col gap-y-0 border border-alternate-light rounded-lg overflow-hidden">
        {/* header */}
        <div className="bg-alternate-light px-4 py-3">
          <h2 className="text-lg font-semibold flex items-center gap-x-4">
            Membres de l&apos;équipe
            <span className="text-sm">({currentEvent?.members.length})</span>
          </h2>
        </div>

        <div className="relative overflow-x-auto">
          {/* empty member list */}
          {currentEvent?.members.length === 0 ? (
            <div className="py-4 flex flex-col items-center text-center gap-y-4">
              <p className="font-semibold">
                Vous n'avez encore aucun membre dans votre équipe
              </p>

              <Button size="small" link={`/events/${currentEvent.id}`}>
                Invitez-les
              </Button>
            </div>
          ) : (
            // filled
            <table className="w-full text-sm text-left rtl:text-right bg-white">
              {/* header */}
              <thead className="uppercase">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Total assignés
                  </th>
                  <th scope="col" className="px-6 py-4">
                    A déjà
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* body */}
              <tbody>
                {currentEvent?.members.map(
                  ({
                    uid,
                    displayName,
                    email,
                    role,
                    assignedTicketsCount,
                    scannedTicketsCount,
                  }) => (
                    <tr
                      key={uid}
                      className="bg-gray-200 border-t border-alternate-light"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 whitespace-nowrap flex flex-col"
                      >
                        <span className="font-semibold">{displayName}</span>
                        <span className="font-medium">{email}</span>
                      </th>

                      <td className="px-6 py-4">
                        {eventMemberRoleInFrench[role]}
                      </td>

                      <td className="px-6 py-4">
                        {assignedTicketsCount} billets
                      </td>

                      <td className="px-6 py-4">
                        {role === EventMemberRole.VENDOR
                          ? "Vendu"
                          : "Controllé"}{" "}
                        {scannedTicketsCount} billets
                      </td>

                      <td className="px-6 py-4 flex items-center gap-x-3 text-sm">
                        <TicketsAttributionDialog memberUid={uid} />

                        <Button
                          size="small"
                          variant="secondary"
                          addStyles="flex items-center gap-x-[6px]"
                        >
                          <RiDeleteBinLine size={20} />
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ManagerAccessWrapper>
  );
};

export default EventTeam;
