"use client";

import { useParams } from "next/navigation";
import ProtectedRoute from "components/ProtectedRoute";

const ScanTicket = () => {
  const { id: eventId } = useParams<{ id: string }>();
  return <div>Scan ticket linked to event num: {eventId} </div>;
};

export default ProtectedRoute(ScanTicket);
