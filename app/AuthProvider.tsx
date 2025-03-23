"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "lib/firebase/client";
import { setUser, removeUser } from "lib/store/slices/authSlice";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        // get user role via its custom claims
        const idTokenResult = await user.getIdTokenResult();
        const claims = idTokenResult.claims;
        const userRole = (
          claims.role &&
          typeof claims.role === "object" &&
          "admin" in claims.role
            ? claims.role.admin
            : false
        ) as boolean;

        const userSerialized = {
          uid: user.uid,
          isAdmin: userRole,
          email: user.email,
          displayName: user.displayName,
          photoUrl: user.photoURL,
        };

        dispatch(setUser(userSerialized));
      } else {
        dispatch(removeUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
