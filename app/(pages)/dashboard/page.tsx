"use client";

import ProtectedRoute from "components/ProtectedRoute";

const Dashboard = () => {
  return (
    <main>
      <h1>Dashboard</h1>
    </main>
  );
};

export default ProtectedRoute(Dashboard);
