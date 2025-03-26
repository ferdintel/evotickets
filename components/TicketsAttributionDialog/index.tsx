"use client";

import toast from "react-hot-toast";
import Button from "components/Button";
import InputField from "components/FormControls/InputField";
import SelectField from "components/FormControls/SelectField";
import ClientPortal from "@/components/ClientPortal";

import { useState } from "react";
import { useParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { firebaseAuth } from "lib/firebase/client";
import { TicketsAttributionFormValues } from "types/Tickets";
import { TicketsAttributionFormValidation } from "validators/tikets";
import { FirebaseError } from "firebase/app";

import { TbTicket } from "react-icons/tb";

type TicketsAttributionDialogProps = {
  memberUid: string;
};

const TicketsAttributionDialog = ({
  memberUid,
}: TicketsAttributionDialogProps) => {
  const params = useParams<{ id: string }>();
  const eventId = params?.id;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketsAttributionFormValues>({
    resolver: zodResolver(TicketsAttributionFormValidation),
    defaultValues: {},
    mode: "onBlur",
  });

  // show and hide dialog
  const [showDialog, setShowDialog] = useState(false);
  const displayDialog = () => setShowDialog(true);
  const hideDialog = () => {
    setShowDialog(false);
    reset();
  };

  // assign tickets to specific member
  const assignTickets = async ({
    quantity,
    category,
  }: TicketsAttributionFormValues) => {
    try {
      const authToken = await firebaseAuth.currentUser?.getIdToken();
      const response = await fetch("/api/tickets/assign", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          eventId,
          memberUid,
          quantity,
          category,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        hideDialog();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof FirebaseError || error instanceof Error
          ? error.message
          : "Une erreur est survenue, veuillez réessayer.";

      toast.error(errorMessage, {
        duration: 5000,
      });
    }
  };

  return (
    <>
      <Button
        size="small"
        variant="secondary"
        onClick={displayDialog}
        addStyles="flex items-center gap-x-[6px]"
      >
        <TbTicket size={20} /> Assigner des billets
      </Button>

      {/* profile and logout buttons */}
      {showDialog && (
        <ClientPortal>
          <>
            <form
              onSubmit={handleSubmit(assignTickets)}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-80 w-full bg-white rounded-xl p-5
        flex flex-col gap-y-4 shadow z-10"
            >
              <div className="flex flex-col gap-y-2">
                <InputField
                  fieldName="quantity"
                  inputType="number"
                  labelText="Nombre de billets"
                  isAutoFocus={true}
                  register={register}
                  errorMessage={errors.quantity?.message}
                />

                <SelectField
                  fieldName="category"
                  labelText="Catégorie de billet"
                  placeholder="Sélectionnez une catégorie"
                  register={register}
                  selectOptions={[
                    { text: "1", value: "1" },
                    { text: "2", value: "2" },
                  ]}
                  errorMessage={errors.category?.message}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  size="small"
                  type="submit"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  Assigner
                </Button>

                <Button
                  size="small"
                  variant="secondary"
                  type="button"
                  onClick={hideDialog}
                >
                  Annuler
                </Button>
              </div>
            </form>

            {/* wrapper to hide dialog when clicked */}
            <div
              onClick={hideDialog}
              className="bg-dark/50 fixed top-0 left-0 w-screen h-screen z-[5]"
            ></div>
          </>
        </ClientPortal>
      )}
    </>
  );
};

export default TicketsAttributionDialog;
