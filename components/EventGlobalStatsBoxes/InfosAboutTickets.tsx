"use client";

import Button from "@/components/Button";

import { useParams } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { selectAuth } from "@/lib/store/slices/authSlice";
import { selectCurrentEvent } from "@/lib/store/slices/currentEventSlice";
import { currencyFormatter } from "@/utils/currency";
import { EventMemberRole } from "@/types/Events";

const InfosAboutTickets = () => {
  const eventId = useParams<{ id: string }>()?.id;
  const { currentUser } = useAppSelector(selectAuth);
  const currentEvent = useAppSelector(selectCurrentEvent);

  const getTotalTicketsSoldCount = () =>
    !currentEvent?.manager
      ? 0
      : currentEvent?.members
          .filter((member) => member.role === EventMemberRole.VENDOR)
          .reduce((acc, curr) => acc + curr.scannedTicketsCount, 0) +
        currentEvent.manager.ticketsSoldCount;

  const getTotalControlledTicketsCount = () =>
    !currentEvent?.manager
      ? 0
      : currentEvent?.members
          .filter((member) => member.role === EventMemberRole.CONTROLLER)
          .reduce((acc, curr) => acc + curr.scannedTicketsCount, 0) +
        currentEvent.manager.controlledTicketsCount;

  return (
    <div className="w-full flex flex-col gap-y-4 bg-white rounded-lg border border-gray-300 p-4">
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
            <span className="font-semibold">{getTotalTicketsSoldCount()}</span>
          </p>

          <p className="flex items-center justify-between">
            <span className="text-foreground/80">
              Billets utilisés (contrôllés)
            </span>
            <span className="font-semibold">
              {getTotalControlledTicketsCount()}
            </span>
          </p>

          <p className="flex items-center justify-between">
            <span className="text-foreground/80">Total de billets générés</span>
            <span className="font-semibold">
              {currentEvent?.manager?.totalTicketsGenerated || 0}
            </span>
          </p>
        </div>

        {/* sales */}
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <p className="text-foreground/80">Revenus encaissés</p>
            <p className="flex items-center gap-x-4 font-semibold text-sm">
              <span>
                {currencyFormatter(
                  currentEvent?.revenueStats.revenueEarned.usd || 0,
                  "USD"
                )}
              </span>
              <span>
                {currencyFormatter(
                  currentEvent?.revenueStats.revenueEarned.cdf || 0,
                  "CDF"
                )}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-foreground/80">Revenus latents</p>
            <p className="flex items-center gap-x-4 font-semibold text-sm">
              <span>
                {currencyFormatter(
                  currentEvent?.revenueStats.unrealizedRevenues.usd || 0,
                  "USD"
                )}
              </span>
              <span>
                {currencyFormatter(
                  currentEvent?.revenueStats.unrealizedRevenues.cdf || 0,
                  "CDF"
                )}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-foreground/80">Total attendu</p>
            <p className="flex items-center gap-x-4 font-semibold text-sm">
              <span>
                {currencyFormatter(
                  currentEvent?.revenueStats.totalExpected.usd || 0,
                  "USD"
                )}
              </span>
              <span>
                {currencyFormatter(
                  currentEvent?.revenueStats.totalExpected.cdf || 0,
                  "CDF"
                )}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfosAboutTickets;
