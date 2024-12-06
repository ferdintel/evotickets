"use client";

import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { firebaseAuth, firestoreDB } from "lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { setUser, removeUser } from "lib/store/slices/authSlice";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // monitoring user authentication
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      console.log('!! ON A ÉTÉ DANS onAuthStateChanged !!');
      if (user) {
        // get user infos
        try {
          const userRef = doc(firestoreDB, "users", user.uid);
          const userInfos = await getDoc(userRef);

          console.log('!!ON VIENT DE LIRE DANS USERS !!');
          

          if (userInfos.exists()) {
            const userSerialized = {
              id: user.uid,
              email: user.email,
              firstName: userInfos.data().firstName,
              lastName: userInfos.data().lastName,
              displayName: user.displayName,
              photoUrl: user.photoURL,
            };

            dispatch(setUser(userSerialized));
          }
        } catch (err) {
          dispatch(removeUser());
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
