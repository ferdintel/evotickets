"use client";

import { useParams } from "next/navigation";
import ProtectedRoute from "components/ProtectedRoute";

const EventTickets = () => {
  const { id: eventId } = useParams<{ id: string }>();
  return (
    <div>
        billets pour l'event: {eventId}
    </div>
  );
};

export default ProtectedRoute(EventTickets);
