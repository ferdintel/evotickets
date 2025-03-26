"use client";

import ClientPortal from "@/components/ClientPortal";

import { useState } from "react";
import { LuX } from "react-icons/lu";

type DialogProps = {
  trigger: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
};

const Dialog = ({ trigger, title, children, onClose }: DialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <>
      <div onClick={openDialog}>{trigger}</div>

      {isOpen && (
        <ClientPortal>
          <div
            className="fixed inset-0 bg-black/50 z-[5]"
            onClick={closeDialog}
          />
          <div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white
            rounded-xl p-6 shadow-lg z-10"
          >
            <header className="mb-6 flex items-center justify-between">
              {title && <h2 className="text-lg font-bold">{title}</h2>}

              <button
                title="Fermer"
                className="px-2 py-[6px] bg-gray-200 text-foreground/80 rounded-md hover:bg-gray-400 duration-300"
                onClick={closeDialog}
              >
                <LuX size={20} strokeWidth={2.5} />
              </button>
            </header>

            {children}
          </div>
        </ClientPortal>
      )}
    </>
  );
};

export default Dialog;
