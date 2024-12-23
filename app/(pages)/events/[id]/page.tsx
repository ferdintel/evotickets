"use client";

import Image from "next/image";
import ProtectedRoute from "components/ProtectedRoute";
import FilledButton from "components/FilledButton";

import { useParams } from "next/navigation";
import { useAppSelector } from "lib/store/hooks";
import { selectCurrentEvent } from "lib/store/slices/currentEventSlice";

import { MdLocationOn } from "react-icons/md";
import { TbCalendarEvent } from "react-icons/tb";
import { BiSolidCategoryAlt } from "react-icons/bi";

import { currencyFormatter } from "utils/currency";
import { DEFAULT_EVENT_CATEGORY } from "validations/common";

const EventGlobalStats = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const currentEvent = useAppSelector(selectCurrentEvent);

  // set a manager
  const setManager = () => {};

  return (
    <div className="grid grid-cols-3 gap-5">
      {/* 1 - infos about event itself */}
      <div className="flex flex-col gap-y-4 bg-white rounded-lg border border-gray-300 p-4">
        {/* header */}
        <div className="-mx-4 pb-4 px-4 flex items-center justify-between border-b border-gray-300">
          <h3 className="font-semibold">Infos. sur l'événement</h3>
          <FilledButton link="#" variant="slate" size="small">
            Éditer
          </FilledButton>
        </div>

        {/* body */}
        <div className="flex flex-col gap-y-3 text-foreground/80 text-sm font-medium">
          {/* cover */}
          <Image
            width={128}
            height={128}
            src={
              currentEvent?.imageCoverUrl ||
              "/images/events/placeholder-image-300x225.png"
            }
            alt={currentEvent?.name || ""}
            className="w-full h-28 object-cover rounded-lg"
          />

          {/* event dates */}
          <div className="flex items-center gap-x-2">
            <span className="p-1 rounded-xl bg-gray-200 border border-gray-300">
              <TbCalendarEvent
                size={20}
                className="min-w-5 text-foreground/80"
              />
            </span>

            <p className="flex items-center gap-x-1">
              <span>{currentEvent?.beginDate}</span>
              <span>·</span>
              <span>{currentEvent?.beginDate}</span>
            </p>
          </div>

          {/* event category */}
          <p className="flex items-center gap-x-2">
            <span className="p-1 rounded-xl bg-gray-200 border border-gray-300">
              <BiSolidCategoryAlt
                size={20}
                className="min-w-5 text-foreground/80"
              />
            </span>

            <span>
              {
                DEFAULT_EVENT_CATEGORY.find(
                  (event) => event.value === currentEvent?.category
                )?.text
              }
            </span>
          </p>

          {/* event location */}
          <p className="flex items-center gap-x-2">
            <span className="p-1 rounded-xl bg-gray-200 border border-gray-300">
              <MdLocationOn size={20} className="min-w-5 text-foreground/80" />
            </span>

            <span>{currentEvent?.location}</span>
          </p>
        </div>
      </div>

      {/* 2 - infos about tickets */}
      <div className="flex flex-col gap-y-4 bg-white rounded-lg border border-gray-300 p-4">
        {/* header */}
        <div className="-mx-4 pb-4 px-4 flex items-center justify-between border-b border-gray-300">
          <h3 className="font-semibold">Billets et ventes</h3>

          <FilledButton
            link={`/events/${eventId}/tickets`}
            variant="slate"
            size="small"
          >
            Détails
          </FilledButton>
        </div>

        {/* body */}
        <div className="flex flex-col gap-y-4">
          {/* tickets */}
          <div className="-mx-4 pb-4 px-4 flex flex-col gap-y-2 border-b border-gray-300">
            <p className="flex items-center justify-between">
              <span className="text-foreground/80">Billets vendus</span>
              <span className="font-semibold">100</span>
            </p>

            <p className="flex items-center justify-between">
              <span className="text-foreground/80">
                Billets utilisés (contrôllés)
              </span>
              <span className="font-semibold">85</span>
            </p>

            <p className="flex items-center justify-between">
              <span className="text-foreground/80">
                Total de billets générés
              </span>
              <span className="font-semibold">185</span>
            </p>
          </div>

          {/* sales */}
          <div className="flex flex-col gap-y-2">
            <p className="flex items-center justify-between">
              <span className="text-foreground/80">Revenus encaissés</span>
              <span className="font-semibold">{currencyFormatter(500)}</span>
            </p>

            <p className="flex items-center justify-between">
              <span className="text-foreground/80">Revenus latents</span>
              <span className="font-semibold">{currencyFormatter(425)}</span>
            </p>

            <p className="flex items-center justify-between">
              <span className="text-foreground/80">Total attendu</span>
              <span className="font-semibold">{currencyFormatter(925)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3 - infos about team */}
      <div className="flex flex-col gap-y-4 bg-white rounded-lg border border-gray-300 p-4">
        {/* header */}
        <div className="-mx-4 pb-4 px-4 flex items-center justify-between border-b border-gray-300">
          <h3 className="font-semibold">Votre équipe en chiffre</h3>

          <FilledButton
            link={`/events/${eventId}/team`}
            variant="slate"
            size="small"
          >
            Détails
          </FilledButton>
        </div>

        {/* body */}
        <div className="flex flex-col gap-y-3">
          <p className="flex items-center justify-between">
            <span className="text-foreground/80">Manager</span>
            {currentEvent?.managerId ? (
              <span className="font-semibold">Gray Mafutala</span>
            ) : (
              <FilledButton size="small" variant="slate" onClick={setManager}>
                Définir un manager
              </FilledButton>
            )}
          </p>

          <p className="flex items-center justify-between">
            <span className="text-foreground/80">Vendeurs</span>
            <span className="font-semibold">
              {
                Object.values(currentEvent?.members || {}).filter(
                  (member) => member.role === "seller"
                ).length
              }
            </span>
          </p>

          <p className="flex items-center justify-between">
            <span className="text-foreground/80">Contrôleurs</span>
            <span className="font-semibold">
              {
                Object.values(currentEvent?.members || {}).filter(
                  (member) => member.role === "controller"
                ).length
              }
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(EventGlobalStats);
