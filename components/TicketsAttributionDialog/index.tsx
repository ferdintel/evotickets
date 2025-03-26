"use client";

import toast from "react-hot-toast";
import Dialog from "components/Dialog";
import Button from "components/Button";
import InputField from "components/FormControls/InputField";
import SelectField from "components/FormControls/SelectField";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { firebaseAuth } from "lib/firebase/client";
import { TicketsAttributionFormValues } from "types/Tickets";
import { TicketsAttributionFormValidation } from "validators/tikets";
import { useParams } from "next/navigation";

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
    defaultValues: { quantity: 0 },
    mode: "onBlur",
  });

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
        body: JSON.stringify({ eventId, memberUid, quantity, category }),
      });

      const data = await response.json();
      response.ok ? toast.success(data.message) : toast.error(data.message);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue";
      toast.error(message, { duration: 5000 });
    }
  };

  return (
    <Dialog
      trigger={
        <Button
          size="small"
          variant="secondary"
          addStyles="flex items-center gap-x-[6px]"
        >
          <TbTicket size={20} /> Assigner des billets
        </Button>
      }
      onClose={reset}
    >
      <form
        onSubmit={handleSubmit(assignTickets)}
        className="flex flex-col gap-y-4"
      >
        <div className="flex flex-col gap-y-2">
          <InputField
            fieldName="quantity"
            inputType="number"
            labelText="Nombre de billets"
            isAutoFocus
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
            onClick={() => reset()}
          >
            Annuler
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default TicketsAttributionDialog;
