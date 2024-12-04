"use client";

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";

import { signOut } from "firebase/auth";
import { firebaseAuth } from "lib/firebase";
import { useAppDispatch, useAppSelector } from "lib/store/hooks";
import { removeUser, selectAuth, setPending } from "lib/store/slices/authSlice";

import { RiArrowDownSLine } from "react-icons/ri";
import { FaRegCircleUser } from "react-icons/fa6";
import { HiOutlineLogout } from "react-icons/hi";

const Header = () => {
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const toggleUserDropdownMenu = () =>
    setShowDropdownMenu((prevState) => !prevState);
  const hideUserDropdownMenu = () => setShowDropdownMenu(false);

  const { currentUser } = useAppSelector(selectAuth);
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
    <header className="bg-dark px-6 py-4 flex items-center justify-between">
      <Link href="/dashboard" className="hover:opacity-80 duration-300">
        <Image
          src="/images/site-logos/logo-evotickets.png"
          width={200}
          height={40}
          priority={true}
          alt="evotickets logo"
          className="max-w-48 h-auto object-contain"
        />
      </Link>

      <div className="relative">
        {/* current user */}
        <button
          onClick={toggleUserDropdownMenu}
          className="flex items-center text-background hover:text-white/80 duration-300"
        >
          <span className="font-medium">
            {`${currentUser?.firstName} ${currentUser?.lastName}`}
          </span>
          <FaRegCircleUser size={28} className="ml-3 mr-2" />
          <RiArrowDownSLine size={20} />
        </button>

        {/* profile and logout buttons */}
        {showDropdownMenu && (
          <div
            className="absolute top-10 right-0 min-w-52 bg-white rounded-xl p-2 flex flex-col gap-y-1
            shadow-[#06182c66_0px_0px_0px_2px,#06182ca6_0px_4px_6px_-1px,#ffffff14_0px_1px_0px_inset] z-10"
          >
            <Link
              href="/profile"
              className="flex items-center gap-x-2 p-3 rounded-lg font-medium text-foreground/85
              hover:bg-alternate-light/40 hover:text-alternate active:bg-alternate-light duration-300"
            >
              <FaRegCircleUser size={20} />
              Mon profil
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-x-2 p-3 rounded-lg font-medium text-foreground/85
              hover:bg-alternate-light/40 hover:text-alternate active:bg-alternate-light duration-300"
            >
              <HiOutlineLogout size={20} />
              Déconnexion
            </button>
          </div>
        )}

        {/* wrapper to hide user dropdown menu when clicking */}
        {showDropdownMenu && (
          <div
            onClick={hideUserDropdownMenu}
            className="bg-transparent fixed top-0 left-0 w-screen h-screen z-[5]"
          ></div>
        )}
      </div>
    </header>
  );
};

export default Header;
