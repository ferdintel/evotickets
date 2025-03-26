"use client";

import Button from "components/Button";
import SelectField from "components/FormControls/SelectField";
import ManagerAccessWrapper from "@/components/ManagerAccessWrapper";
import GenerateNewTicketsDialog from "@/components/GenerateNewTicketsDialog";

import { selectAuth } from "@/lib/store/slices/authSlice";
import { useAppSelector } from "@/lib/store/hooks";

import { RiFolderDownloadFill } from "react-icons/ri";

const EventTickets = () => {
  const { currentUser, pending } = useAppSelector(selectAuth);

  return (
    <ManagerAccessWrapper>
      <div className="flex flex-col gap-y-0 border border-alternate-light rounded-lg overflow-hidden">
        {/* header */}
        <header className="bg-alternate-light px-4 py-3 flex items-center justify-between">
          {/* title */}
          <h2 className="text-lg font-semibold flex items-center gap-x-4">
            Liste des billets générés
            <span className="text-sm">({0})</span>
          </h2>

          <div className="flex items-center gap-x-4">
            <GenerateNewTicketsDialog />

            <Button size="small" addStyles="flex items-center gap-x-[6px]">
              <RiFolderDownloadFill size={20} />
              Télécharger les QRCodes
            </Button>
          </div>
        </header>

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
                  Devise
                </th>
                <th scope="col" className="px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>

            {/* body */}
            <tbody>
              <tr className="bg-gray-200 border-t border-alternate-light">
                <th
                  scope="row"
                  className="px-6 py-4 font-semibold whitespace-nowrap"
                >
                  25c3bd94-78f0-4510-95ea-c8099b25e1d0
                </th>
                <td className="px-6 py-4">Valid</td>
                <td className="px-6 py-4">Printed</td>
                <td className="px-6 py-4">Normal</td>
                <td className="px-6 py-4">5.00</td>
                <td className="px-6 py-4">USD</td>
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

              <tr className="bg-gray-100 border-t border-alternate-light">
                <th
                  scope="row"
                  className="px-6 py-4 font-semibold whitespace-nowrap"
                >
                  25c3bd94-78f0-4510-95ea-c8099b25e1d0
                </th>
                <td className="px-6 py-4">Valid</td>
                <td className="px-6 py-4">Printed</td>
                <td className="px-6 py-4">Normal</td>
                <td className="px-6 py-4">5.00</td>
                <td className="px-6 py-4">USD</td>
                <td className="px-6 py-4">
                  <SelectField
                    placeholder="Sélectionnez une action"
                    selectOptions={[
                      { text: "Valid", value: "Valid" },
                      { text: "Active", value: "Active" },
                      { text: "Used", value: "Used" },
                      { text: "Invalid", value: "Invalid" },
                    ]}
                    addLabelStyles="w-fit"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ManagerAccessWrapper>
  );
};

export default EventTickets;
