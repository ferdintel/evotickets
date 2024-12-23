"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "lib/store/hooks";
import { selectAuth } from "lib/store/slices/authSlice";

import PageLoader from "components/PageLoader";

const ProtectedRoute = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithProtection = (props: P) => {
    const { pending, currentUser } = useAppSelector(selectAuth);
    const router = useRouter();

    useEffect(() => {
      if (!pending && !currentUser) {
        router.push("/login");
      }
    }, [pending, currentUser, router]);

    if (pending || !currentUser) return <PageLoader />;

    return <WrappedComponent {...props} />;
  };

  WithProtection.displayName = `ProtectedRoute(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithProtection;
};

export default ProtectedRoute;
