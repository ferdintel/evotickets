"use client";

import ProtectedRoute from "components/ProtectedRoute";
import Header from "components/Header";

const Dashboard = () => {
  return (
    <>
      <Header />

      <main className="flex-grow border border-red-500">
        <h1>Dashboard</h1>
      </main>
    </>
  );
};

export default ProtectedRoute(Dashboard);
