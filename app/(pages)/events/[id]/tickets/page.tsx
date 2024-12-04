"use client";

import { useParams } from "next/navigation";

import Header from "components/Header";
import ProtectedRoute from "components/ProtectedRoute";

const Tickets = () => {
  const { id: eventId } = useParams<{ id: string }>();
  return (
    <div>
      <Header />
      <h1>List of tickets linked to event num: {eventId}</h1>
    </div>
  );
};

export default ProtectedRoute(Tickets);
