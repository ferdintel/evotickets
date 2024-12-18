"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "lib/store/hooks";
import { selectAuth } from "lib/store/slices/authSlice";

import PageLoader from "components/PageLoader";

const ProtectedRoute = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const auth = useAppSelector(selectAuth);
    const router = useRouter();

    useEffect(() => {
      if (!auth.pending && auth.currentUser === null) {
        router.push("/login");
      }
    }, [auth]);

    if (auth.pending) {
      return <PageLoader />;
    }

    if (auth.currentUser !== null) return <WrappedComponent {...props} />;
    else return <PageLoader />;
  };
};

export default ProtectedRoute;
