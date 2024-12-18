"use client";

import { useParams } from "next/navigation";
import ProtectedRoute from "components/ProtectedRoute";

const EventTicketsScan = () => {
  const { id: eventId } = useParams<{ id: string }>();
  return (
    <div>
        scanner (pour activer/vendre/controller) un billet pour l&apos;event: {eventId}
    </div>
  );
};

export default ProtectedRoute(EventTicketsScan);
