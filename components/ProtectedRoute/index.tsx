"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "lib/store/hooks";
import { selectAuth } from "lib/store/slices/authSlice";

import PageLoader from "components/PageLoader";

const ProtectedRoute = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const { pending, currentUser } = useAppSelector(selectAuth);
    const router = useRouter();

    useEffect(() => {
      if (!pending && currentUser === null) {
        router.push("/login");
      }
    }, [currentUser, router]);

    if (pending) {
      return <PageLoader />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default ProtectedRoute;
