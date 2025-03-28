"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "components/Button";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "lib/firebase/client";
import { useAppDispatch, useAppSelector } from "lib/store/hooks";
import { removeUser, selectAuth } from "lib/store/slices/authSlice";

import { BiLoaderCircle } from "react-icons/bi";
import { LuCalendarPlus } from "react-icons/lu";
import { HiOutlineLogout } from "react-icons/hi";
import { FaRegCircleUser } from "react-icons/fa6";
import { usePathname } from "next/navigation";

const navLinks = [
  { title: "Tableau de bord", link: "/dashboard" },
  { title: "Événements", link: "/events" },
  { title: "Invitations", link: "/invitations" },
];

const Header = () => {
  const pathName = usePathname() as string;

  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const toggleUserDropdownMenu = () =>
    setShowDropdownMenu((prevState) => !prevState);
  const hideUserDropdownMenu = () => setShowDropdownMenu(false);

  const { currentUser, pending } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const logout = async () => {
    hideUserDropdownMenu();
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      if (error) dispatch(removeUser());
    }
  };

  return (
    <header
      className="-mx-4 mobileM:-mx-5 px-4 mobileM:px-5 py-4 bg-dark flex items-center
      justify-between"
    >
      {/* logo */}
      <Link href="/" className="hover:opacity-80 duration-300">
        <Image
          src="/images/site-logos/logo-evotickets.png"
          width={200}
          height={40}
          alt="evotickets logo"
          priority={true}
          className="max-w-48 h-auto object-contain"
        />
      </Link>

      {/* right content */}
      <div className="flex items-center gap-x-4 text-[#f8f4ff]">
        {/* navlinks */}
        {currentUser && (
          <nav className="flex items-center gap-x-4">
            {navLinks.map(({ title, link }) => (
              <Link
                key={link}
                href={link}
                className={`${
                  pathName.endsWith(link)
                    ? "bg-alternate-light/50 text-white"
                    : "hover:text-white/80"
                } px-2 py-1 rounded-md duration-300 text-nowrap`}
              >
                {title}
              </Link>
            ))}

            {/* btn to create event - display for only admin */}
            {currentUser?.isAdmin && (
              <Link
                href="/events/create"
                title="Créer un événement"
                className="p-2 rounded-[4px] hover:bg-alternate-light focus:bg-alternate-light focus:shadow-[0px_0px_0px_4px_#ffffff1f]
              duration-300"
              >
                <LuCalendarPlus size={24} />
              </Link>
            )}
          </nav>
        )}

        {/* user account */}
        {currentUser ? (
          <div className="relative">
            {/* trigger button */}
            <button
              title="Mon compte"
              disabled={pending}
              onClick={toggleUserDropdownMenu}
              className="w-10 h-10 bg-alternate/90 rounded-[4px] font-medium hover:bg-alternate-light
              focus:bg-alternate focus:shadow-[0px_0px_0px_4px_#ffffff1f] flex justify-center items-center
              duration-300"
            >
              {pending ? (
                <span className="animate-spin">
                  <BiLoaderCircle size={20} />
                </span>
              ) : (
                currentUser?.displayName?.charAt(0)
              )}
            </button>

            {/* drop down menu content */}
            {showDropdownMenu && (
              <div
                className="absolute top-12 right-0 min-w-52 bg-white rounded-xl p-2 flex flex-col gap-y-1
                shadow z-10"
              >
                <Link
                  href="/profile"
                  onClick={hideUserDropdownMenu}
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

            {/* wrapper to hide the user dropdown menu when clicked */}
            {showDropdownMenu && (
              <div
                onClick={hideUserDropdownMenu}
                className="bg-transparent fixed top-0 left-0 w-screen h-screen z-[5]"
              ></div>
            )}
          </div>
        ) : (
          // btn to login
          <Button link="/login">Connexion</Button>
        )}
      </div>
    </header>
  );
};

export default Header;
