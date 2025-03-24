"use client";

import { useParams } from "next/navigation";

import Button from "components/Button";

const EventTicketsScan = () => {
  const eventId = useParams<{ id: string }>()?.id;

  const handleScan = (value: string) => {
    console.log("scanned:", value);
  };

  const handleError = (error: Error) => {
    console.log("error:", error);
  };

  return (
    <div className="flex flex-col gap-y-0 border border-alternate-light rounded-lg overflow-hidden">
      {/* header */}
      <div className="bg-alternate-light px-4 py-3">
        <h2 className="text-lg font-semibold">Scannage des billets</h2>
      </div>

      <div className="h-80">
        {/* <QrScanner resolution={600} style={{ width: '50%', height: '85%' }} onScan={handleScan} onError={handleError} /> */}
      </div>

      <div className="mb-4 flex items-center justify-center gap-x-4">
        <Button>Scanner pour vendre</Button>
        <Button>Scanner pour contrôler</Button>
      </div>
    </div>
  );
};

export default EventTicketsScan;
