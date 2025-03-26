"use client";

import toast from "react-hot-toast";
import Button from "components/Button";
import Dialog from "@/components/Dialog";
import InputField from "components/FormControls/InputField";
import SelectField from "components/FormControls/SelectField";

import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { firebaseAuth } from "lib/firebase/client";

import {
  DefaultCurrencies,
  ETicketType,
  GenerateTicketsFormValues,
  ticketTypeInFrench,
} from "types/Tickets";

import { GenerateTicketsFormValidation } from "validators/tikets";

import { TbTicket } from "react-icons/tb";

const GenerateNewTicketsDialog = () => {
  const params = useParams<{ id: string }>();
  const eventId = params?.id;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GenerateTicketsFormValues>({
    resolver: zodResolver(GenerateTicketsFormValidation),
    defaultValues: {
      ticketCount: 0,
      ticketCategory: "Normal",
      ticketPrice: {
        value: 0,
        currency: DefaultCurrencies.USD,
      },
      ticketType: ETicketType.ELECTRONIC,
    },
    mode: "onTouched",
  });

  const generateTickets = async ({
    ticketCount,
    ticketCategory,
    ticketPrice,
    ticketType,
  }: GenerateTicketsFormValues) => {
    try {
      const authToken = await firebaseAuth.currentUser?.getIdToken();
      const response = await fetch("/api/tickets/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          eventId,
          ticketCount,
          ticketCategory,
          ticketPrice,
          ticketType,
        }),
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
    title="Générer des nouveaux billets"
      trigger={
        <Button size="small" addStyles="flex items-center gap-x-[6px]">
          <TbTicket size={20} />
          Générer des nouveaux billets
        </Button>
      }
      onClose={reset}
    >
      <form
        onSubmit={handleSubmit(generateTickets)}
        className="flex flex-col gap-y-4"
      >
        <div className="flex flex-col gap-y-2">
          <div className="flex gap-x-4">
            <InputField
              inputType="number"
              fieldName="ticketCount"
              labelText="Nombre de billets"
              placeholder="Ex : 120"
              register={register}
              isAutoFocus
              errorMessage={errors.ticketCount?.message}
            />

            <SelectField
              fieldName="ticketType"
              labelText="Type de billets"
              placeholder="Sélectionnez un type"
              register={register}
              selectOptions={Object.values(ETicketType).map((item) => ({
                text: ticketTypeInFrench[item],
                value: item,
              }))}
              errorMessage={errors.ticketType?.message}
            />
          </div>

          <div className="flex gap-x-4">
            <InputField
              fieldName="ticketCategory"
              labelText="Catégorie"
              placeholder="Ex : VIP"
              register={register}
              errorMessage={errors.ticketCategory?.message}
            />

            <InputField
              inputType="number"
              fieldName="ticketPrice.value"
              labelText="Prix"
              placeholder="Prix d'un ticket"
              register={register}
              errorMessage={errors.ticketPrice?.value?.message}
            />
          </div>

          <SelectField
            fieldName="ticketPrice.currency"
            labelText="Dévise"
            placeholder="Sélectionnez une devise"
            register={register}
            selectOptions={Object.values(DefaultCurrencies).map((currency) => ({
              text: currency,
              value: currency,
            }))}
            errorMessage={errors.ticketPrice?.currency?.message}
          />
        </div>

        {/* submit button */}
        <Button
          size="small"
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Générer
        </Button>
      </form>
    </Dialog>
  );
};

export default GenerateNewTicketsDialog;
