"use client";

import { useParams } from "next/navigation";
import ProtectedRoute from "components/ProtectedRoute";

const Tickets = () => {
  const { id: eventId } = useParams<{ id: string }>();
  return <div>List of tickets linked to event num: {eventId} </div>;
};

export default ProtectedRoute(Tickets);
