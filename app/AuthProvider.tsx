"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, firebaseDB } from "lib/firebase/client";
import { setUser, removeUser } from "lib/store/slices/authSlice";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // monitoring user authentication
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        try {
          // get user profile
          const userRef = doc(firebaseDB, "users", user.uid);
          const userInfos = await getDoc(userRef);

          // get user role via its custom claims
          const userRole = await user.getIdTokenResult()
            .then((idTokenResult) => {
              const claims = idTokenResult.claims;
              return claims.role && typeof claims.role === 'object' && 'admin' in claims.role ? claims.role.admin : false;
            }) as boolean;

          if (userInfos.exists()) {
            const userSerialized = {
              uid: user.uid,
              isAdmin: userRole,
              email: user.email,
              firstName: userInfos.data().firstName,
              lastName: userInfos.data().lastName,
              displayName: user.displayName,
              photoUrl: user.photoURL,
            };

            dispatch(setUser(userSerialized));
          }
        } catch (err) {
          if (err) dispatch(removeUser());
        }
      } else {
        dispatch(removeUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
