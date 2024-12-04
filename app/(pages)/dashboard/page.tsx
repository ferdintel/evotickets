"use client";

import { signOut } from "firebase/auth";
import { firebaseAuth } from "lib/firebase";
import { useAppDispatch } from "lib/store/hooks";
import { removeUser, setPending } from "lib/store/slices/authSlice";

import FilledButton from "components/FilledButton";
import ProtectedRoute from "components/ProtectedRoute";

const Dashboard = () => {
  const dispatch = useAppDispatch();

  const logout = async () => {
    try {
      dispatch(setPending(true));
      await signOut(firebaseAuth);
    } catch (err) {
      dispatch(removeUser());
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <FilledButton onClick={logout} addStyles="mt-4 self-start">Se déconnecter</FilledButton>
    </div>
  );
};

export default ProtectedRoute(Dashboard);
