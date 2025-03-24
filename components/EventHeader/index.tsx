"use client";

import Link from "next/link";

import { useParams, usePathname, useRouter } from "next/navigation";

import { useAppSelector } from "lib/store/hooks";
import { selectAuth } from "lib/store/slices/authSlice";
import { selectCurrentEvent } from "lib/store/slices/currentEventSlice";

import { LuArrowLeft } from "react-icons/lu";
import { PiUsersThree } from "react-icons/pi";
import { TbHomeStats, TbLineScan, TbTicket } from "react-icons/tb";

const eventTabs = [
  { title: "Global", link: "/", icon: <TbHomeStats size={20} /> },
  { title: "Billeterie", link: "tickets", icon: <TbTicket size={20} /> },
  { title: "Équipe", link: "team", icon: <PiUsersThree size={20} /> },
  { title: "Scanner", link: "scan", icon: <TbLineScan size={20} /> },
];

const EventHeader = () => {
  const eventId = useParams<{ id: string }>()?.id;
  const pathName = usePathname() as string;

  const route = useRouter();

  const currentEvent = useAppSelector(selectCurrentEvent);
  const { currentUser, pending } = useAppSelector(selectAuth);

  const eventUserRole = pending
    ? "..."
    : currentUser?.isAdmin
    ? "administrateur"
    : currentEvent?.managerEmail === currentUser?.email
    ? "manager"
    : currentUser?.uid &&
      currentEvent?.members[currentUser.uid]?.role === "seller"
    ? "vendeur"
    : "contrôleur";

  return (
    <>
      {currentUser && (
        <div
          className="py-6 -mx-4 mobileM:-mx-5 px-4 mobileM:px-5 bg-white border-b border-gray-300
          flex items-center justify-between"
        >
          <div className="flex items-center gap-x-4">
            <button
              className="bg-alternate-light/50 text-foreground/80 hover:bg-alternate-light hover:text-alternate
              p-1 rounded-md duration-300"
              onClick={route.back}
            >
              <LuArrowLeft size={20} />
            </button>

            <div className="flex flex-col">
              {/* title */}
              <h1
                className="bg-gradient-to-bl from-accent via-alternate to-accent bg-clip-text
              text-transparent leading-normal text-xl font-semibold"
              >
                {currentEvent?.name}
              </h1>
              <p className="text-foreground/80 text-sm font-medium">
                Vous êtes un {eventUserRole} pour cet événement
              </p>
            </div>
          </div>

          {/* event tabs */}
          <div className="flex items-center gap-x-1 font-semibold text-foreground/80 text-sm">
            {eventTabs.map(({ title, link, icon }) => (
              <Link
                key={title}
                href={
                  link ? `/events/${eventId}/${link}` : `/events/${eventId}`
                }
                className={`flex items-center gap-x-1 px-2 py-[6px] rounded-md duration-300
            ${
              title === "Global" && pathName === `/events/${eventId}`
                ? "bg-alternate-light/50 text-alternate"
                : pathName.endsWith(link)
                ? "bg-alternate-light/50 text-alternate"
                : "hover:text-alternate"
            }`}
              >
                <span> {icon} </span>
                {title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default EventHeader;
