"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toLocalDatetimeString } from "utils/time";
import { CreateEventFormValues } from "types/Events";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_EVENT_CATEGORY } from "validations/common";
import { CreateEventFormValidation } from "validations/events";

import Header from "components/Header";
import ProtectedRoute from "components/ProtectedRoute";
import ImageFileSelect from "components/ImageFileSelect";
import InputField from "components/FormControls/InputField";
import SelectField from "components/FormControls/SelectField";
import FilledButton from "components/FilledButton";

const CreateEvent = () => {
  const nowWithTimeZone = toLocalDatetimeString(new Date());
  const nowPlus2HourWithTimeZone = toLocalDatetimeString(
    new Date(new Date().getTime() + 1 * 60 * 60 * 1000)
  );

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(CreateEventFormValidation),
    defaultValues: {
      eventName: "",
      eventCategory: "",
      eventDate: {
        begin: nowWithTimeZone,
        end: nowPlus2HourWithTimeZone,
      },
      eventPlace: "",
    },
    mode: "onTouched",
  });

  const router = useRouter();
  const [eventCoverImage, setEventCoverImage] = useState<string | null>(null);

  const createEvent = async (eventData: CreateEventFormValues) => {
    console.log("eventData:", eventData);
  };

  return (
    <>
      <Header />

      <main className="my-8 max-w-2xl mx-auto w-full flex flex-col gap-y-3 ">
        <h1 className="text-xl font-bold">Créer un événement</h1>

        <form
          onSubmit={handleSubmit(createEvent)}
          className="w-full flex flex-col gap-y-6"
        >
          <div className="flex flex-col gap-y-4 bg-white py-8 px-6 rounded-xl border border-slate-300">
            <div className="flex gap-x-4">
              <InputField
                fieldName="eventName"
                labelText="Nom"
                register={register}
                placeholder="Ex : Concert Moïse Mbiye"
                isAutoFocus={true}
                errorMessage={errors.eventName?.message}
              />

              <SelectField
                fieldName="eventCategory"
                labelText="Catégorie ou type"
                register={register}
                selectOptions={DEFAULT_EVENT_CATEGORY}
                errorMessage={errors.eventCategory?.message}
              />
            </div>

            <div className="flex gap-x-4">
              <InputField
                inputType="datetime-local"
                fieldName="eventDate.begin"
                labelText="Début"
                register={register}
                errorMessage={errors.eventDate?.begin?.message}
              />

              <InputField
                inputType="datetime-local"
                fieldName="eventDate.end"
                labelText="Fin"
                register={register}
                errorMessage={errors.eventDate?.end?.message}
              />
            </div>

            <InputField
              fieldName="eventPlace"
              labelText="Localisation"
              register={register}
              placeholder="Ex : Avenue Des Huileries, Kinshasa"
              errorMessage={errors.eventPlace?.message}
            />

            <ImageFileSelect
              title="Image de couverture (optionnelle)"
              imageFile={eventCoverImage}
              setImageFile={setEventCoverImage}
            />
          </div>

          {/* btn to cancel and to create an event */}
          <div className="flex items-center justify-between">
            <FilledButton
              type="button"
              variant="slate"
              onClick={() => router.back()}
            >
              Annuler
            </FilledButton>

            <FilledButton disabled={isSubmitting} isLoading={isSubmitting}>
              Créer mon événment
            </FilledButton>
          </div>
        </form>
      </main>
    </>
  );
};

export default ProtectedRoute(CreateEvent);
