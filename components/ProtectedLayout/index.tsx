"use client";

import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

type ProtectedLayoutProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

const ProtectedLayout = ({ children, adminOnly }: ProtectedLayoutProps) => {
  return <>{children}</>;
};

export default ProtectedRoute(ProtectedLayout);
