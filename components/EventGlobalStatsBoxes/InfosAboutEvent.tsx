"use client";

import Image from "next/image";
import Button from "@/components/Button";

import { useParams } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { selectAuth } from "@/lib/store/slices/authSlice";
import { selectCurrentEvent } from "@/lib/store/slices/currentEventSlice";
import { DEFAULT_EVENT_CATEGORY } from "@/validators/common";

import { BiSolidCategoryAlt } from "react-icons/bi";
import { TbCalendarEvent } from "react-icons/tb";
import { MdLocationOn } from "react-icons/md";

const InfosAboutEvent = () => {
  const eventId = useParams<{ id: string }>()?.id;
  const { currentUser } = useAppSelector(selectAuth);
  const currentEvent = useAppSelector(selectCurrentEvent);

  const isAdminOrEventManage = () =>
    currentUser?.isAdmin || currentUser?.uid === currentEvent?.manager?.uid;

  return (
    <div className="w-full flex flex-col gap-y-4 bg-white rounded-lg border border-gray-300 p-4">
      {/* header */}
      <div className="-mx-4 pb-4 px-4 flex items-center justify-between border-b border-gray-300">
        <h3 className="font-semibold">Infos. sur l&apos;événement</h3>

        {isAdminOrEventManage() && (
          <Button link="#" variant="secondary" size="small">
            Éditer
          </Button>
        )}
      </div>

      {/* body */}
      <div className="flex flex-col gap-y-3 text-foreground/80 text-sm font-medium">
        {/* cover */}
        <Image
          width={128}
          height={128}
          src={
            currentEvent?.imageCoverUrl ||
            "/images/events/placeholder-image-300x225.png"
          }
          alt={currentEvent?.name || ""}
          quality={60}
          unoptimized
          placeholder="blur"
          blurDataURL="/images/events/placeholder-image-300x225.png"
          className="w-full h-28 object-cover rounded-lg"
        />

        {/* event dates */}
        <div className="flex items-center gap-x-2">
          <span className="p-1 rounded-xl bg-gray-200 border border-gray-300">
            <TbCalendarEvent size={20} className="min-w-5 text-foreground/80" />
          </span>

          <p className="flex items-center gap-x-1">
            <span>{currentEvent?.beginDate}</span>
            <span>·</span>
            <span>{currentEvent?.beginDate}</span>
          </p>
        </div>

        {/* event category */}
        <p className="flex items-center gap-x-2">
          <span className="p-1 rounded-xl bg-gray-200 border border-gray-300">
            <BiSolidCategoryAlt
              size={20}
              className="min-w-5 text-foreground/80"
            />
          </span>

          <span>
            {
              DEFAULT_EVENT_CATEGORY.find(
                (event) => event.value === currentEvent?.category
              )?.text
            }
          </span>
        </p>

        {/* event location */}
        <p className="flex items-center gap-x-2">
          <span className="p-1 rounded-xl bg-gray-200 border border-gray-300">
            <MdLocationOn size={20} className="min-w-5 text-foreground/80" />
          </span>

          <span>{currentEvent?.location}</span>
        </p>
      </div>
    </div>
  );
};

export default InfosAboutEvent;
