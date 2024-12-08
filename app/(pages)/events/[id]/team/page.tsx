"use client";

import { useParams } from "next/navigation";
import ProtectedRoute from "components/ProtectedRoute";

const EventTeam = () => {
  const { id: eventId } = useParams<{ id: string }>();
  return (
    <div>
        team pour l'event: {eventId}
    </div>
  );
};

export default ProtectedRoute(EventTeam);
