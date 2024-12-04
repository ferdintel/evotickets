"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { firebaseAuth } from "lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { setUser, removeUser } from "lib/store/slices/authSlice";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // monitoring user authentication
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        const userSerialized = {
          id: user.uid,
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
