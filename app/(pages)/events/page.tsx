"use client";

import { useState } from "react";

import EventCard from "components/EventCard";
import InputField from "components/FormControls/InputField";
import useDocsFromFirestore from "hooks/useDocsFromFirestore";
import FetchDataErrorDisplay from "components/FetchDataErrorDisplay";
import ProtectedLayout from "@/components/ProtectedLayout";

import { EventDataType } from "types/Events";
import { getQueryUserEventsAllowed } from "utils/queries";
import { QueryConstraint } from "firebase/firestore";
import { eventCollectionRef } from "@/utils/collectionRefs";

import { BiLoaderCircle } from "react-icons/bi";
import { LuCalendarMinus } from "react-icons/lu";

const Events = () => {
  // to get all events associated with the current user
  const { docs, isLoading, error } = useDocsFromFirestore<EventDataType>(
    eventCollectionRef,
    getQueryUserEventsAllowed() as unknown as QueryConstraint[]
  );

  // for search and sorting event list
  const [searchValue, setSearchValue] = useState("");
  const handleInputSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" || e.key === "NumpadEnter") {
      setSearchValue(e.currentTarget.value);
    }
  };

  // to reset filtering when input is empty
  const handleInputSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") setSearchValue("");
  };

  return (
    <ProtectedLayout>
      <main className="mb-8 flex flex-col gap-y-8">
        {/* header */}
        <div
          className="py-6 -mx-4 mobileM:-mx-5 px-4 mobileM:px-5 bg-white border-b border-gray-300
          flex items-center justify-between"
        >
          {/* title */}
          <div className="flex flex-col gap-y-1">
            <h1 className="text-xl font-semibold">Événements</h1>
            <p className="text-foreground/80 font-medium">
              Liste des événements ({docs.length})
            </p>
          </div>

          {/* searchbar and sorting */}
          {docs.length > 0 && (
            <div className="w-sm flex items-center gap-x-3">
              <InputField
                inputType="search"
                placeholder="Rechercher un événement"
                onKeyDown={handleInputSearchKeyDown}
                onChange={handleInputSearchChange}
              />
            </div>
          )}
        </div>

        {/* when an error has occurred */}
        {error && <FetchDataErrorDisplay msg={error.message} />}

        {/* is loading */}
        {!error && isLoading && (
          <p className="flex items-center justify-center text-center font-medium gap-x-4">
            Chargement des événements
            <span className="animate-spin text-alternate">
              <BiLoaderCircle size={20} />
            </span>
          </p>
        )}

        {/* sucess case */}
        {!error && !isLoading && docs.length === 0 ? (
          // event list is empty
          <div className="mt-4 flex flex-col items-center text-center gap-y-2">
            <span className="w-28 h-28 flex items-center justify-center rounded-[2rem] bg-gray-200 border border-gray-300">
              <LuCalendarMinus
                size={48}
                className="min-w-12 text-foreground/60"
              />
            </span>

            <p className="text-lg font-semibold">
              Vous n&apos;avez aucun événement
            </p>
            <p className="text-foreground/80 text-sm font-medium">
              La liste de vos événements sera affichée ici.
            </p>
          </div>
        ) : (
          // event list is filled
          !error &&
          !isLoading &&
          docs.length > 0 && (
            <ul className="grid grid-cols-3 gap-5">
              {docs
                .filter((currentEvent) =>
                  currentEvent.name
                    .toLocaleLowerCase()
                    .startsWith(searchValue.toLocaleLowerCase())
                )
                .map((data) => (
                  <EventCard key={data.id} eventData={data} />
                ))}
            </ul>
          )
        )}
      </main>
    </ProtectedLayout>
  );
};

export default Events;
