"use client";

import { useRouter } from "next/navigation";

import { signOut } from "firebase/auth";
import { firebaseAuth } from "lib/firebase/client";
import { useAppDispatch } from "lib/store/hooks";
import { removeUser } from "lib/store/slices/authSlice";

import Button from "@/components/Button";
import ProtectedRoute from "@/components/ProtectedRoute";

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      router.push("/login");
    } catch (error) {
      if (error) dispatch(removeUser());
    }
  };

  return (
    <div className="">
      <h1>Dashboard</h1>
      <Button onClick={logout}>Déconnexion</Button>
    </div>
  );
};

export default ProtectedRoute(Dashboard);
