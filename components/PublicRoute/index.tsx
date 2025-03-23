"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { selectAuth } from "@/lib/store/slices/authSlice";

import PageLoader from "@/components/PageLoader";

const PublicRoute = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const PublicRouteWrapper = (props: P) => {
    const { pending, currentUser } = useAppSelector(selectAuth);
    const router = useRouter();

    useEffect(() => {
      if (currentUser) router.replace("/dashboard");
    }, [currentUser, pending, router]);

    if (currentUser === null) return <WrappedComponent {...props} />;
    else return <PageLoader />;
  };

  PublicRouteWrapper.displayName = `PublicRoute(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return PublicRouteWrapper;
};

export default PublicRoute;
