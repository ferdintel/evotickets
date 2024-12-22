"use client";

import toast from "react-hot-toast";
import FilledButton from "components/FilledButton";
import ProtectedRoute from "components/ProtectedRoute";
import InputField from "components/FormControls/InputField";
import SelectField from "components/FormControls/SelectField";
import ToastSuccessMessage from "components/ToastSuccessMessage";

import { useForm } from "react-hook-form";
// import { useParams } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenerateTicketsFormValidation } from "validations/tikets";
import { DefaultCurrencies, GenerateTicketsFormValues } from "types/Tickets";
import { RiFolderDownloadFill } from "react-icons/ri";

const EventTickets = () => {
  // const { id: eventId } = useParams<{ id: string }>();

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
              pour l&apos;événement{" "}
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
            Générer les billets
          </FilledButton>
        </form>
      </div>

      {/* list of tickets */}
      <div className="flex flex-col gap-y-0 border border-alternate-light rounded-lg overflow-hidden">
        {/* header */}
        <div className="bg-alternate-light px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Liste des billets générés</h2>
          <FilledButton size="small" addStyles="flex items-center gap-x-[6px]">
            <RiFolderDownloadFill size={20} />
            Télécharger les QRCodes
          </FilledButton>
        </div>

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
                      { text: "Valid", value: "Valid" },
                      { text: "Active", value: "Active" },
                      { text: "Used", value: "Used" },
                      { text: "Invalid", value: "Invalid" },
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
    </div>
  );
};

export default ProtectedRoute(EventTickets);
