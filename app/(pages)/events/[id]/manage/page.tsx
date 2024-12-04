"use client";

import { useParams } from "next/navigation";

import Header from "components/Header";
import ProtectedRoute from "components/ProtectedRoute";

const ManageEvent = ({ params }: { params: { id: string } }) => {
  const { id: eventId } = useParams<{ id: string }>();
  return (
    <div>
      <Header />
      <h1>Manage event num: {eventId} </h1>
    </div>
  );
};

export default ProtectedRoute(ManageEvent);
