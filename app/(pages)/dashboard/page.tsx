"use client";

import ProtectedRoute from "components/ProtectedRoute";
import Header from "components/Header";

const Dashboard = () => {
  return (
    <>
      <Header />

      <main>
        <h1>Dashboard</h1>
      </main>
    </>
  );
};

export default ProtectedRoute(Dashboard);
