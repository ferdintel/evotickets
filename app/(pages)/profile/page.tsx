"use client";

import Header from "components/Header";
import ProtectedRoute from "components/ProtectedRoute";

const Profile = () => {
  return (
    <div>
      <Header />
      <h1>Profile</h1>
    </div>
  );
};

export default ProtectedRoute(Profile);
