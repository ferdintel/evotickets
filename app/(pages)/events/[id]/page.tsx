"use client";

import InfosAboutTeam from "@/components/EventGlobalStatsBoxes/InfosAboutTeam";
import InfosAboutTickets from "@/components/EventGlobalStatsBoxes/InfosAboutTickets";
import InfosAboutEvent from "@/components/EventGlobalStatsBoxes/InfosAboutEvent";
import FetchDataErrorDisplay from "@/components/FetchDataErrorDisplay";
import ProtectedLayout from "@/components/ProtectedLayout";

import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectAuth } from "@/lib/store/slices/authSlice";
import { setCurrentEvent } from "@/lib/store/slices/currentEventSlice";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { eventCollectionRef } from "@/utils/collectionRefs";
import { CurrentEventDataSerialized, EventDataType } from "@/types/Events";

import { BiLoaderCircle } from "react-icons/bi";

const EventGlobalStats = () => {
  const eventId = useParams<{ id: string }>()?.id;

  // to fetch current event data
  const dispatch = useAppDispatch();
  const [currentEventData, setCurrentEventData] = useState<EventDataType>();
  const [eventIsloading, setEventIsLoading] = useState(true);
  const [eventError, setEventError] = useState<Error | null>(null);
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setEventIsLoading(false);
        return;
      }

      try {
        setEventIsLoading(true);
        const docRef = doc(eventCollectionRef, eventId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const eventData = {
            id: docSnap.id,
            ...docSnap.data(),
          } as EventDataType;

          // set current event
          const eventDataSerialized: CurrentEventDataSerialized = {
            ...eventData,
            beginDate: eventData.beginDate.toDate().toLocaleString(),
            endDate: eventData.endDate.toDate().toLocaleString(),
            createdAt: eventData.createdAt.toDate().toLocaleString(),
            updatedAt: eventData.updatedAt.toDate().toLocaleString(),
          };
          dispatch(setCurrentEvent(eventDataSerialized));

          setCurrentEventData({ ...eventData });
        } else {
          setEventError(
            new Error(`L'événement ayant l'id: ${eventId} n'a pas été trouvé`)
          );
        }
      } catch (err) {
        if (err instanceof Error) {
          setEventError(err);
        }
      } finally {
        setEventIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const { currentUser } = useAppSelector(selectAuth);

  const isAdminOrEventManage = () =>
    currentUser?.isAdmin || currentUser?.uid === currentEventData?.manager?.uid;

  return (
    <ProtectedLayout>
      {/* when an error has occurred */}
      {eventError && <FetchDataErrorDisplay msg={eventError.message} />}

      {/* is loading */}
      {!eventError && eventIsloading && (
        <p className="flex items-center justify-center text-center font-medium gap-x-4">
          Chargement des données sur l'événement
          <span className="animate-spin text-alternate">
            <BiLoaderCircle size={20} />
          </span>
        </p>
      )}

      {/* sucess case */}
      {!eventError && !eventIsloading && (
        <div className="flex gap-x-5">
          {/* 1 - infos about event itself */}
          <InfosAboutEvent />

          {/* 2 - infos about tickets */}
          {isAdminOrEventManage() && <InfosAboutTickets />}

          {/* 3 - infos about team */}
          <InfosAboutTeam />
        </div>
      )}
    </ProtectedLayout>
  );
};

export default EventGlobalStats;
