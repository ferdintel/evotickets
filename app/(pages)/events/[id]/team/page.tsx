"use client";

import Button from "components/Button";

import { TbTicket } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";

const EventTeam = () => {
  return (
    <div className="flex flex-col gap-y-0 border border-alternate-light rounded-lg overflow-hidden">
      {/* header */}
      <div className="bg-alternate-light px-4 py-3">
        <h2 className="text-lg font-semibold">Membres de l&apos;équipe</h2>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right bg-white">
          {/* header */}
          <thead className="uppercase">
            <tr>
              <th scope="col" className="px-6 py-4">
                Nom
              </th>
              <th scope="col" className="px-6 py-4">
                Role
              </th>
              <th scope="col" className="px-6 py-4">
                Total assignés
              </th>
              <th scope="col" className="px-6 py-4">
                A déjà
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
                Juvenal Bobenze
              </th>
              <td className="px-6 py-4">Vendeur</td>
              <td className="px-6 py-4">40 billets</td>
              <td className="px-6 py-4">Vendu 13 billets</td>
              <td className="px-6 py-4 flex items-center gap-x-3 text-sm">
                <Button
                  size="small"
                  variant="secondary"
                  addStyles="flex items-center gap-x-[6px]"
                >
                  <TbTicket size={20} /> Attribuer des billets
                </Button>
                <Button
                  size="small"
                  variant="secondary"
                  addStyles="flex items-center gap-x-[6px]"
                >
                  <RiDeleteBinLine size={20} />
                  Supprimer
                </Button>
              </td>
            </tr>

            <tr className="bg-gray-100 border-t border-alternate-light">
              <th
                scope="row"
                className="px-6 py-4 font-semibold whitespace-nowrap"
              >
                Gray Mafutala
              </th>
              <td className="px-6 py-4">Contrôleur</td>
              <td className="px-6 py-4">65 billets</td>
              <td className="px-6 py-4">Controllé 28 billets</td>
              <td className="px-6 py-4 flex items-center gap-x-4 text-sm">
                <Button
                  size="small"
                  variant="secondary"
                  addStyles="flex items-center gap-x-[6px]"
                >
                  <TbTicket size={20} /> Attribuer des billets
                </Button>
                <Button
                  size="small"
                  variant="secondary"
                  addStyles="flex items-center gap-x-[6px]"
                >
                  <RiDeleteBinLine size={20} />
                  Supprimer
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventTeam;
