"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "lib/store/hooks";
import { selectAuth } from "lib/store/slices/authSlice";
import PageLoader from "components/PageLoader";

type ProtectedRouteProps = {
  children?: React.ReactNode;
  adminOnly?: boolean;
};

const ProtectedRoute = <P extends ProtectedRouteProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithProtection = (props: P) => {
    const router = useRouter();
    const { pending, currentUser } = useAppSelector(selectAuth);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      if (!pending) {
        if (!currentUser) {
          router.push("/login");
        } else if (props.adminOnly && !currentUser.isAdmin) {
          router.push("/forbidden");
        }

        setIsChecking(false);
      }
    }, [pending, currentUser, props.adminOnly, router]);

    // show loader when during checks
    if (pending || isChecking) {
      return <PageLoader />;
    }

    // Blocks rendering if unauthorized (for fast client browsing)
    if (!currentUser || (props.adminOnly && !currentUser.isAdmin)) {
      return <PageLoader />;
    }

    return <WrappedComponent {...props} />;
  };

  WithProtection.displayName = `ProtectedRoute(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithProtection;
};

export default ProtectedRoute;
