"use client";

import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

type ProtectedRoutesLayoutProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

const ProtectedRoutesLayout = ({
  children,
  adminOnly,
}: ProtectedRoutesLayoutProps) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default ProtectedRoute(ProtectedRoutesLayout);
