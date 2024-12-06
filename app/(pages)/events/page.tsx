"use client";

import Header from "components/Header";
import ProtectedRoute from "components/ProtectedRoute";

const Events = () => {
  return (
    <div>
      <Header />
      <h1>List of all events</h1>
    </div>
  );
};

export default ProtectedRoute(Events);
