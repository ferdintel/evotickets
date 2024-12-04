"use client";

import { useParams } from "next/navigation";

import Header from "components/Header";
import ProtectedRoute from "components/ProtectedRoute";

const ScanTicket = () => {
  const { id: eventId } = useParams<{ id: string }>();
  return (
    <div>
      <Header />
      <h1>Scan ticket linked to event num: {eventId} </h1>
    </div>
  );
};

export default ProtectedRoute(ScanTicket);
