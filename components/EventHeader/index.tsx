"use client";

import Link from "next/link";

import { useAppSelector } from "lib/store/hooks";
import { selectCurrentEvent } from "lib/store/slices/currentEventSlice";
import { useParams, usePathname } from "next/navigation";

import { PiUsersThree } from "react-icons/pi";
import { TbHomeStats, TbLineScan, TbTicket } from "react-icons/tb";

const eventTabs = [
  { title: "Global", link: "/", icon: <TbHomeStats size={20} /> },
  { title: "Billeterie", link: "tickets", icon: <TbTicket size={20} /> },
  { title: "Équipe", link: "team", icon: <PiUsersThree size={20} /> },
  { title: "Scanner", link: "scan", icon: <TbLineScan size={20} /> },
];

const EventHeader = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const pathName = usePathname();
  const currentEvent = useAppSelector(selectCurrentEvent);

  return (
    <div
      className="py-6 -mx-4 mobileM:-mx-5 px-4 mobileM:px-5 bg-white border-b border-gray-300
      flex items-center justify-between"
    >
      {/* title */}
      <div className="flex flex-col gap-y-1">
        <h1
          className="bg-gradient-to-bl from-accent via-alternate to-accent bg-clip-text
          text-transparent leading-normal text-xl font-semibold"
        >
          {currentEvent?.name}
        </h1>
        <p className="text-foreground/80 text-sm font-medium">
          Vous êtes un admin/manager/vendeur/controlleur pour cet événement
        </p>
      </div>

      {/* event tabs */}
      <div className="flex items-center gap-x-1 font-semibold text-foreground/80 text-sm">
        {eventTabs.map(({ title, link, icon }) => (
          <Link
            key={title}
            href={link ? `/events/${eventId}/${link}` : `/events/${eventId}`}
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
  );
};

export default EventHeader;
