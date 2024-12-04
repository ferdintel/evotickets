"use client";

import ProtectedRoute from "components/ProtectedRoute";
import Header from "components/Header";

const Dashboard = () => {


  return (
    <div>
      <Header />
      <h1>Dashboard</h1>
    </div>
  );
};

export default ProtectedRoute(Dashboard);
