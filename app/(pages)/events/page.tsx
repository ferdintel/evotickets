"use client";

import EventCard from "components/EventCard";
import ProtectedRoute from "components/ProtectedRoute";
import InputField from "components/FormControls/InputField";
import useGetDocsFromFirestore from "hooks/useGetDocsFromFirestore";
import FetchDataErrorDisplay from "components/FetchDataErrorDisplay";

import { useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { LuCalendarMinus } from "react-icons/lu";
import type { EventDataType } from "types/Events";

const EVENTS_COLLECTION_NAME = "events";

const Events = () => {
  const { docs, isLoading, error } = useGetDocsFromFirestore<EventDataType>(
    EVENTS_COLLECTION_NAME
  );

  // search and sorting management
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
    <main className="mb-8 flex flex-col gap-y-8">
      {/* header */}
      <div
        className="py-6 -mx-4 mobileM:-mx-5 px-4 mobileM:px-5 bg-white border-b border-gray-300
          flex items-center justify-between"
      >
        {/* title */}
        <div className="flex flex-col gap-y-1">
          <h1 className="text-xl font-semibold">Événements</h1>
          <p className="text-foreground/80 text-sm font-medium">
            Liste des événements ({docs.length})
          </p>
        </div>

        {/* searchbar and sorting */}
        <div className="flex items-center gap-x-3">
          <InputField
            placeholder="Rechercher un événement"
            onKeyDown={handleInputSearchKeyDown}
            onChange={handleInputSearchChange}
          />
        </div>
      </div>

      {/* when an error has occurred */}
      {error && <FetchDataErrorDisplay msg={error.message} />}

      {/* is loading */}
      {!error && isLoading && (
        <p className="flex items-center justify-center text-center font-medium gap-x-4">
          Chargement des événements{" "}
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
      )}
    </main>
  );
};

export default ProtectedRoute(Events);
