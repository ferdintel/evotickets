"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "lib/firebase";
import { setUser, removeUser } from "lib/store/slices/authSlice";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // monitoring user authentication
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        // get user infos
        try {
          const userRef = doc(firestoreDB, "users", user.uid);
          const userInfos = await getDoc(userRef);

          if (userInfos.exists()) {
            const userSerialized = {
              uid: user.uid,
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
