"use client";

import { useParams } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { selectAuth } from "@/lib/store/slices/authSlice";
import { selectCurrentEvent } from "@/lib/store/slices/currentEventSlice";

import Button from "components/Button";

const EventTicketsScan = () => {
  const eventId = useParams<{ id: string }>()?.id;
  const { currentUser, pending } = useAppSelector(selectAuth);
  const currentEvent = useAppSelector(selectCurrentEvent);

  const handleScanToSell = (value: string) => {
    console.log("scanned - sell:", value);
  };

  const handleScanToControl = (value: string) => {
    console.log("scanned - control:", value);
  };

  const handleError = (error: Error) => {
    console.log("error:", error);
  };

  return (
    <div className="flex flex-col gap-y-0 border border-alternate-light rounded-lg overflow-hidden">
      {/* header */}
      <div className="bg-alternate-light px-4 py-3">
        <h2 className="text-lg font-semibold flex items-center gap-x-4">
          Scannage des billets
          <span className="text-sm">(20/60)</span>
        </h2>
      </div>

      <div className="h-80">
        {/* <QrScanner resolution={600} style={{ width: '50%', height: '85%' }} onScan={handleScan} onError={handleError} /> */}
      </div>

      {/* btn to scan */}
      <div className="mb-4 flex items-center justify-center gap-x-4">
        {currentUser?.isAdmin ||
          (currentUser?.uid === currentEvent?.manager?.uid && (
            <Button>Scanner pour vendre</Button>
          ))}

        {currentUser?.isAdmin ||
          (currentUser?.uid === currentEvent?.manager?.uid && (
            <Button>Scanner pour contrôler</Button>
          ))}
      </div>
    </div>
  );
};

export default EventTicketsScan;
