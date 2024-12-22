"use client";

import ProtectedRoute from "components/ProtectedRoute";
import { selectAuth } from "lib/store/slices/authSlice";
import { useAppSelector } from "lib/store/hooks";
import {
  MdOutlineEventAvailable,
  MdOutlineEventNote,
  MdOutlineSell,
} from "react-icons/md";
import { currencyFormatter } from "utils/currency";
import { GiTakeMyMoney } from "react-icons/gi";
import { HiOutlineTicket } from "react-icons/hi";
import { TbLineScan } from "react-icons/tb";

const Dashboard = () => {
  const { currentUser } = useAppSelector(selectAuth);

  return (
    <main className="mb-8 flex flex-col pt-6 gap-y-8">
      <header className="flex flex-col gap-y-1">
        <h1 className="text-xl font-semibold">
          Bonjour {currentUser?.firstName}
        </h1>

        <p className="text-foreground/80 text-sm font-medium">
          Bienvenue sur le tableau de bord global !
        </p>
      </header>

      {/* total completed events */}
      <section className="grid grid-cols-5 gap-6">
        {/* events completed */}
        <div className="bg-white border border-gray-300 rounded-lg p-4 flex items-center gap-x-4">
          <span>
            <MdOutlineEventAvailable className="size-8 text-alternate" />
          </span>

          <p className="flex flex-col gap-y-1">
            <span className="text-foreground/80 text-sm/tight">
              Événements réalisés
            </span>
            <span className="text-lg font-semibold">99 999</span>
          </p>
        </div>

        {/* total cash generated */}
        <div className="bg-white border border-gray-300 rounded-lg p-4 flex items-center gap-x-4">
          <span>
            <GiTakeMyMoney className="size-8 text-alternate" />
          </span>

          <p className="flex flex-col gap-y-1">
            <span className="text-foreground/80 text-sm/tight">
              Total revenus générés en tant que manager
            </span>
            <span className="text-lg font-semibold">
              {currencyFormatter(435, "USD")}
            </span>
          </p>
        </div>

        {/* total events in progress */}
        <div className="bg-white border border-gray-300 rounded-lg p-4 flex items-center gap-x-4">
          <span>
            <MdOutlineEventNote className="size-8 text-alternate" />
          </span>

          <p className="flex flex-col gap-y-1">
            <span className="text-foreground/80 text-sm/tight">
              Événements en cours
            </span>
            <span className="text-lg font-semibold">5</span>
          </p>
        </div>

        {/* total tickets sold */}
        <div className="bg-white border border-gray-300 rounded-lg p-4 flex items-center gap-x-4">
          <span>
            <MdOutlineSell className="size-8 text-alternate" />
          </span>

          <p className="flex flex-col gap-y-1">
            <span className="text-foreground/80 text-sm/tight">
              Total billets vendus
            </span>
            <span className="text-lg font-semibold">100</span>
          </p>
        </div>

        {/* total tickets checked */}
        <div className="bg-white border border-gray-300 rounded-lg p-4 flex items-center gap-x-4">
          <span>
            <TbLineScan className="size-8 text-alternate" />
          </span>

          <p className="flex flex-col gap-y-1">
            <span className="text-foreground/80 text-sm/tight">
              Total billets contrôlés
            </span>
            <span className="text-lg font-semibold">300</span>
          </p>
        </div>
      </section>

      {/* charts infos */}
      <section
        className="rounded-lg border border-gray-300 p-4 flex justify-between gap-x-16"
      >
        <div className="w-3/5 h-20 border">chart1</div>
        <div className="w-2/5 h-20 border">chart2</div>
      </section>
    </main>
  );
};

export default ProtectedRoute(Dashboard);
