"use client";

import { useParams } from "next/navigation";
import ProtectedRoute from "components/ProtectedRoute";

const ManageEvent = ({ params }: { params: { id: string } }) => {
  const { id: eventId } = useParams<{ id: string }>();
  return <div>Manage event num: {eventId} </div>;
};

export default ProtectedRoute(ManageEvent);
