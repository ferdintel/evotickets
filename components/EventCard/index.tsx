import Link from "next/link";
import Image from "next/image";

import { useAppSelector } from "lib/store/hooks";
import { selectAuth } from "lib/store/slices/authSlice";

import { EventDataType, eventMemberRoleInFrench } from "types/Events";

import { MdLocationOn } from "react-icons/md";
import { TbCalendarEvent } from "react-icons/tb";
import { FaRegCircleUser } from "react-icons/fa6";
import { BiSolidCategoryAlt } from "react-icons/bi";

import { DEFAULT_EVENT_CATEGORY } from "validators/common";

type EventCardProps = {
  eventData: EventDataType;
};

const EventCard = ({ eventData }: EventCardProps) => {
  const { currentUser } = useAppSelector(selectAuth);

  return (
    <li>
      <Link
        href={`events/${eventData.id}`}
        className="w-full flex items-center gap-x-4 p-4 rounded-lg bg-white group
        shadow hover:shadow-[5px_5px_var(--alternate-light)] duration-300"
      >
        {/* cover */}
        <div className="w-1/2 rounded-lg overflow-hidden">
          <Image
            width={128}
            height={84}
            src={
              eventData.imageCoverUrl ||
              "/images/events/placeholder-image-300x225.png"
            }
            alt={eventData.name}
            quality={60}
            unoptimized
            placeholder="blur"
            blurDataURL="/images/events/placeholder-image-300x225.png"
            className="min-w-32 w-full h-32 object-cover group-hover:scale-125 duration-300"
          />
        </div>

        {/* details */}
        <div className="w-1/2 flex flex-col gap-y-1">
          <h3
            // className="bg-gradient-to-bl from-accent via-alternate to-accent bg-clip-text
            // text-transparent leading-normal font-semibold truncate"
            className="font-semibold truncate"
          >
            {eventData.name}
          </h3>

          <div className="flex flex-col gap-y-1 text-foreground text-sm">
            <p className="flex items-center gap-x-1 truncate">
              <BiSolidCategoryAlt
                size={16}
                className="min-w-4 text-foreground/80"
              />
              <span className="truncate">
                {
                  DEFAULT_EVENT_CATEGORY.find(
                    (event) => event.value === eventData.category
                  )?.text
                }
              </span>
            </p>

            <p className="flex items-center gap-x-1 truncate">
              <TbCalendarEvent
                size={16}
                strokeWidth={2.5}
                className="min-w-4 text-foreground/80"
              />
              <span className="truncate">
                {eventData.beginDate.toDate().toLocaleString()}
              </span>
            </p>

            <p className="flex items-center gap-x-1">
              <MdLocationOn size={16} className="min-w-4 text-foreground/80" />
              <span className="truncate">{eventData.location}</span>
            </p>

            {/* role  */}
            <p className="flex items-center gap-x-1">
              <FaRegCircleUser size={16} />
              {currentUser?.isAdmin ? (
                <span>Manager: {eventData?.manager?.displayName || "—"}</span>
              ) : currentUser?.uid === eventData.manager?.uid ? (
                <span>Rôle: Manager</span>
              ) : (
                <span className="truncate">
                  Role:{" "}
                  {
                    eventMemberRoleInFrench[
                      eventData.members.find(
                        ({ uid }) => uid === currentUser?.uid
                      )?.role as "VENDOR" | "CONTROLLER"
                    ]
                  }
                </span>
              )}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default EventCard;
