"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toLocalDatetimeString } from "utils/time";
import {
  CreateEventFormValues,
  EventCover,
  StoreEventDataType,
} from "types/Events";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { firestoreDB } from "lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { DEFAULT_EVENT_CATEGORY } from "validations/common";
import { CreateEventFormValidation } from "validations/events";
import { useAppSelector } from "lib/store/hooks";
import { selectAuth } from "lib/store/slices/authSlice";
import { uploadEventCoverToCloudStorage } from "lib/firebase/cloudStorage";

import toast from "react-hot-toast";
import FilledButton from "components/FilledButton";
import ProtectedRoute from "components/ProtectedRoute";
import ImageFileSelect from "components/ImageFileSelect";
import InputField from "components/FormControls/InputField";
import SelectField from "components/FormControls/SelectField";
import ToastSuccessMessage from "components/ToastSuccessMessage";

const CreateEvent = () => {
  const { currentUser } = useAppSelector(selectAuth);

  const nowWithTimeZone = toLocalDatetimeString(new Date());
  const nowPlus2HourWithTimeZone = toLocalDatetimeString(
    new Date(new Date().getTime() + 1 * 60 * 60 * 1000)
  );

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(CreateEventFormValidation),
    defaultValues: {
      eventName: "",
      eventCategory: "",
      eventDate: {
        begin: nowWithTimeZone,
        end: nowPlus2HourWithTimeZone,
      },
      eventLocation: "",
    },
    mode: "onTouched",
  });

  const router = useRouter();
  const [eventCover, setEventCover] = useState<EventCover>({
    imageFile: null,
    imagePreview: null,
  });

  const createEvent = async (eventData: CreateEventFormValues) => {
    try {
      // 1 - upload event cover in cloud storage if is provided
      let eventCoverUrl = eventCover.imagePreview
        ? await uploadEventCoverToCloudStorage(eventCover.imageFile as File)
        : null;

      // 2 - store event data in firestore
      const eventsCollectionRef = collection(firestoreDB, "events");
      const data: StoreEventDataType = {
        name: eventData.eventName,
        category: eventData.eventCategory,
        beginDate: Timestamp.fromDate(eventData.eventDate.begin as Date),
        endDate: Timestamp.fromDate(eventData.eventDate.end as Date),
        location: eventData.eventLocation,
        imageCoverUrl: eventCoverUrl || "",
        createdBy: currentUser!.id,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      };
      const eventCreated = await addDoc(eventsCollectionRef, data);

      // if event is created
      if (eventCreated.id) {
        // go to events page (to show list of events)
        router.push("/events", { scroll: true });

        // show success message
        toast.success(
          (t) => (
            <ToastSuccessMessage toastId={t.id}>
              <p>
                Bravo ! L'événement{" "}
                <span
                  className="font-semibold bg-gradient-to-bl from-accent via-alternate
                  to-accent bg-clip-text text-transparent leading-normal"
                >
                  {eventData.eventName}
                </span>{" "}
                a été créé avec succès !
              </p>
            </ToastSuccessMessage>
          ),
          { duration: 5000, icon: "👏🏻", style: { paddingRight: "0px" } }
        );
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        toast.error(err.message, {
          duration: 5000,
        });
      }
    }
  };

  return (
    <main className="my-8 max-w-2xl mx-auto w-full flex flex-col gap-y-3">
      <h1 className="text-xl font-semibold">Créer un événement</h1>

      <form
        onSubmit={handleSubmit(createEvent)}
        className="w-full flex flex-col gap-y-6"
      >
        <div className="flex flex-col gap-y-4 bg-white py-8 px-6 rounded-xl border border-gray-300">
          <div className="flex gap-x-4">
            <InputField
              fieldName="eventName"
              labelText="Nom"
              placeholder="Ex : Concert Moïse Mbiye"
              register={register}
              isAutoFocus={true}
              errorMessage={errors.eventName?.message}
            />

            <SelectField
              fieldName="eventCategory"
              labelText="Catégorie ou type"
              register={register}
              selectOptions={[...DEFAULT_EVENT_CATEGORY]}
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
            fieldName="eventLocation"
            labelText="Localisation"
            register={register}
            placeholder="Ex : Avenue Des Huileries, Kinshasa"
            errorMessage={errors.eventLocation?.message}
          />

          <ImageFileSelect
            title="Image de couverture (falcultative)"
            eventCoverPreview={eventCover.imagePreview}
            setEventCover={setEventCover}
            // max 5Mb
            maxSizeInByte={1000 * 1000 * 5}
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
  );
};

export default ProtectedRoute(CreateEvent);
