"use client";

import toast from "react-hot-toast";
import FilledButton from "components/FilledButton";
import ProtectedRoute from "components/ProtectedRoute";
import InputField from "components/FormControls/InputField";
import SelectField from "components/FormControls/SelectField";
import ToastSuccessMessage from "components/ToastSuccessMessage";

import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenerateTicketsFormValidation } from "validations/tikets";
import { DefaultCurrencies, GenerateTicketsFormValues } from "types/Tickets";

const EventTickets = () => {
  const { id: eventId } = useParams<{ id: string }>();

  const {
    handleSubmit,
    register,
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
    },
    mode: "onTouched",
  });

  const generateTickets = async (
    ticketsToGenerate: GenerateTicketsFormValues
  ) => {
    // debug
    console.log("ticketsToGenerate:", ticketsToGenerate);

    try {
      // show success message
      toast.success(
        (t) => (
          <ToastSuccessMessage toastId={t.id}>
            <p>
              Bravo !{" "}
              <span
                className="font-semibold bg-gradient-to-bl from-accent via-alternate
                to-accent bg-clip-text text-transparent leading-normal"
              >
                {"N"} tickets générés{" "}
              </span>
              pour l'événement{" "}
              <span
                className="font-semibold bg-gradient-to-bl from-accent via-alternate
                to-accent bg-clip-text text-transparent leading-normal"
              >
                {"xzy"}
              </span>{" "}
              avec succès !
            </p>
          </ToastSuccessMessage>
        ),
        { duration: 5000, icon: "👏🏻", style: { paddingRight: "0px" } }
      );
    } catch (err) {
      if (err instanceof FirebaseError) {
        toast.error(err.message, {
          duration: 5000,
        });
      }

      console.log(err);
    }
  };

  return (
    <div className="flex flex-col gap-y-6">
      {/* tickets generation */}
      <div className="flex flex-col gap-y-2">
        <h2 className="text-lg font-semibold">
          Génération des nouveaux billets
        </h2>

        <form
          onSubmit={handleSubmit(generateTickets)}
          className="flex flex-col gap-y-3"
        >
          <div className="grid grid-cols-4 gap-x-4 bg-white p-4 mobileM:p-5 rounded-xl border border-gray-300">
            <InputField
              inputType="number"
              fieldName="ticketCount"
              labelText="Nombre de billets"
              placeholder="Ex : 120"
              register={register}
              errorMessage={errors.ticketCount?.message}
            />

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

            <SelectField
              fieldName="ticketPrice.currency"
              labelText="Dévise"
              placeholder="Sélectionnez une devise"
              register={register}
              selectOptions={Object.values(DefaultCurrencies).map(
                (currency) => ({
                  text: currency,
                  value: currency,
                })
              )}
              errorMessage={errors.ticketPrice?.currency?.message}
            />
          </div>

          <FilledButton
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            addStyles="self-end"
          >
            Générer des billets
          </FilledButton>
        </form>
      </div>

      {/* list of tickets */}
      <div className="flex flex-col gap-y-2">
        <h2 className="text-lg font-semibold">Liste des billets générés</h2>

        <table className="w-full bg-white rounded-lg border border-slate-300">
          <thead className="rounded-lg">
            <tr className="rounded-lg border border-red-500">
              <th className="py-2 px-4 border-b">Code</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Catégorie</th>
              <th className="py-2 px-4 border-b">Prix</th>
              <th className="py-2 px-4 border-b">Devise</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>

          <tbody className="">
            <tr>
              <td className="py-2 px-4 border-b">
                25c3bd94-78f0-4510-95ea-c8099b25e1d0
              </td>
              <td className="py-2 px-4 border-b">Valid</td>
              <td className="py-2 px-4 border-b">Normal</td>
              <td className="py-2 px-4 border-b">5.00</td>
              <td className="py-2 px-4 border-b">USD</td>
              <td className="py-2 px-4 border-b">
                <select className="border p-1 rounded">
                  <option value="Valid">Valid</option>
                  <option value="Active">Active</option>
                  <option value="Used">Used</option>
                  <option value="Invalid">Invalid</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProtectedRoute(EventTickets);
