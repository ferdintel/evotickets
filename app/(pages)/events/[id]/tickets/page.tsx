"use client";

import Button from "components/Button";
import SelectField from "components/FormControls/SelectField";
import ManagerAccessWrapper from "@/components/ManagerAccessWrapper";
import useDocsFromFirestore from "@/hooks/useDocsFromFirestore";
import GenerateNewTicketsDialog from "@/components/GenerateNewTicketsDialog";
import FetchDataErrorDisplay from "@/components/FetchDataErrorDisplay";

import {
  TicketsDataType,
  ticketStatusInFrench,
  ticketTypeInFrench,
} from "@/types/Tickets";
import { QueryConstraint } from "firebase/firestore";
import { getQueryUserTicketsAllowed } from "@/utils/queries";

import { RiFolderDownloadFill } from "react-icons/ri";
import { ticketsCollectionRef } from "@/utils/collectionRefs";

import { BiLoaderCircle } from "react-icons/bi";
import { TbTicket } from "react-icons/tb";
import { currencyFormatter } from "@/utils/currency";

const EventTickets = () => {
  // to get all tickets associated with the current user
  const { docs, isLoading, error } = useDocsFromFirestore<TicketsDataType>(
    ticketsCollectionRef,
    getQueryUserTicketsAllowed() as unknown as QueryConstraint[]
  );

  return (
    <ManagerAccessWrapper>
      <div className="flex flex-col gap-y-0 border border-alternate-light rounded-lg overflow-hidden">
        {/* header */}
        <header className="bg-alternate-light px-4 py-3 flex items-center justify-between">
          {/* title */}
          <h2 className="text-lg font-semibold flex items-center gap-x-4">
            Liste des billets générés
            <span className="text-sm">({docs.length})</span>
          </h2>

          <div className="flex items-center gap-x-4">
            <GenerateNewTicketsDialog />

            {docs.length > 0 && (
              <Button size="small" addStyles="flex items-center gap-x-[6px]">
                <RiFolderDownloadFill size={20} />
                Télécharger les QRCodes
              </Button>
            )}
          </div>
        </header>

        {/* when an error has occurred */}
        {error && (
          <div className="pb-4">
            <FetchDataErrorDisplay msg={error.message} />
          </div>
        )}

        {/* is loading */}
        {!error && isLoading && (
          <p className="my-4 flex items-center justify-center text-center font-medium gap-x-4">
            Chargement des billets
            <span className="animate-spin text-alternate">
              <BiLoaderCircle size={20} />
            </span>
          </p>
        )}

        {/* sucess case */}
        {!error && !isLoading && docs.length === 0 ? (
          // ticket list is empty
          <div className="my-6 flex flex-col items-center text-center gap-y-2">
            <span className="w-28 h-28 flex items-center justify-center rounded-[2rem] bg-gray-200 border border-gray-300">
              <TbTicket size={48} className="min-w-12 text-foreground/60" />
            </span>

            <p className="text-lg font-semibold">
              Vous n&apos;avez pas encore généré de billets
            </p>
            <p className="text-foreground/80 text-sm font-medium">
              La liste de vos billets sera affichée ici.
            </p>
          </div>
        ) : (
          // ticket list is filled
          !error &&
          !isLoading &&
          docs.length > 0 && (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right bg-white">
                {/* header */}
                <thead className="uppercase">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Code
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Catégorie
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Prix
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* body */}
                <tbody>
                  {docs.map(({ id, code, status, category, price, type }) => (
                    <tr
                      key={id}
                      className="even:bg-gray-200 odd:bg-gray-100 border-t border-alternate-light"
                    >
                      <th
                        scope="row"
                        title={code}
                        className="px-6 py-4 font-semibold whitespace-nowrap cursor-pointer"
                      >
                        {code.slice(0,8)}...
                      </th>

                      <td className="px-6 py-4">
                        {ticketStatusInFrench[status]}
                      </td>

                      <td className="px-6 py-4">{ticketTypeInFrench[type]}</td>

                      <td className="px-6 py-4">{category}</td>

                      <td className="px-6 py-4">
                        {currencyFormatter(price.value, price.currency)}
                      </td>

                      <td className="px-6 py-4">
                        <SelectField
                          placeholder="Sélectionnez une action"
                          selectOptions={[
                            { text: "Valide", value: "Valid" },
                            { text: "Actif", value: "Active" },
                            { text: "Utilisé", value: "Used" },
                            { text: "Invalide", value: "Invalid" },
                          ]}
                          addLabelStyles="w-fit"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </ManagerAccessWrapper>
  );
};

export default EventTickets;
