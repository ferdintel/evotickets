"use client";

import Header from "components/Header";
import ProtectedRoute from "components/ProtectedRoute";

const CreateEvent = () => {
  return (
    <div>
      <Header />
      <h1>CreateEvent</h1>
    </div>
  );
};

export default ProtectedRoute(CreateEvent);
