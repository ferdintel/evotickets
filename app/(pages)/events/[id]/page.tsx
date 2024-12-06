"use client";

import { useParams } from "next/navigation";

import Header from "components/Header";
import ProtectedRoute from "components/ProtectedRoute";

const page = () => {
  const { id: eventId } = useParams<{ id: string }>();
  return (
    <>
      <Header />

      <main>
        <h1>Current event id = {eventId}</h1>
      </main>
    </>
  );
};

export default ProtectedRoute(page);
