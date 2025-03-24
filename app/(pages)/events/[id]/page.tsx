"use client";

import Image from "next/image";
import Button from "components/Button";
import SetManagerDialog from "components/SetManagerDialog";
import InviteMemberDialog from "@/components/InviteMemberDialog";
import ProtectedLayout from "@/components/ProtectedLayout";

import { useParams } from "next/navigation";
import { useAppSelector } from "lib/store/hooks";
import { selectCurrentEvent } from "lib/store/slices/currentEventSlice";

import { currencyFormatter } from "utils/currency";
import { DEFAULT_EVENT_CATEGORY } from "validators/common";
import { selectAuth } from "lib/store/slices/authSlice";

import { MdLocationOn } from "react-icons/md";
import { TbCalendarEvent } from "react-icons/tb";
import { BiSolidCategoryAlt } from "react-icons/bi";

const EventGlobalStats = () => {
  const eventId = useParams<{ id: string }>()?.id;
  const { currentUser } = useAppSelector(selectAuth);
  const currentEvent = useAppSelector(selectCurrentEvent);

  return (
    <ProtectedLayout>
      <div className="grid grid-cols-3 gap-5">
        {/* 1 - infos about event itself */}
        <div className="flex flex-col gap-y-4 bg-white rounded-lg border border-gray-300 p-4">
          {/* header */}
          <div className="-mx-4 pb-4 px-4 flex items-center justify-between border-b border-gray-300">
            <h3 className="font-semibold">Infos. sur l&apos;événement</h3>
            <Button link="#" variant="secondary" size="small">
              Éditer
            </Button>
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
              quality={60}
              unoptimized
              placeholder="blur"
              blurDataURL="/images/events/placeholder-image-300x225.png"
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
                <MdLocationOn
                  size={20}
                  className="min-w-5 text-foreground/80"
                />
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

            <Button
              link={`/events/${eventId}/tickets`}
              variant="secondary"
              size="small"
            >
              Détails
            </Button>
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
            <h3 className="font-semibold">Votre équipe</h3>

            <Button
              link={`/events/${eventId}/team`}
              variant="secondary"
              size="small"
            >
              Détails
            </Button>
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
                    : currentEvent.manager.displayName + ' · ' + currentEvent.manager.email }
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

            <div className="grow flex justify-center items-center">
              {/* button to add a user to your team */}
              <InviteMemberDialog />
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default EventGlobalStats;
