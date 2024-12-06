"use client";

import Header from "components/Header";
import ProtectedRoute from "components/ProtectedRoute";

const Invitations = () => {
  return (
    <div>
      <Header />
      <h1>Invitations</h1>
    </div>
  );
};

export default ProtectedRoute(Invitations);
