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
import { firebaseDB } from "lib/firebase/client";

import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { DEFAULT_EVENT_CATEGORY } from "validators/common";
import { CreateEventFormValidation } from "validators/events";
import { useAppSelector } from "lib/store/hooks";
import { selectAuth } from "lib/store/slices/authSlice";
import { uploadEventCoverToCloudStorage } from "lib/firebase/cloudStorage";

import toast from "react-hot-toast";
import Button from "components/Button";
import ImageFileSelect from "components/ImageFileSelect";
import InputField from "components/FormControls/InputField";
import SelectField from "components/FormControls/SelectField";
import ToastSuccessMessage from "components/ToastSuccessMessage";
import ProtectedLayout from "@/components/ProtectedLayout";

const CreateEvent = () => {
  const { currentUser } = useAppSelector(selectAuth);

  const nowWithTimeZone = toLocalDatetimeString(new Date());
  const nowPlus2HoursWithTimeZone = toLocalDatetimeString(
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
      eventCategory: "autre",
      eventDate: {
        begin: nowWithTimeZone,
        end: nowPlus2HoursWithTimeZone,
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
      const eventCoverUrl = eventCover.imagePreview
        ? await uploadEventCoverToCloudStorage(eventCover.imageFile as File)
        : null;

      // 2 - store event data in firestore
      const eventsCollectionRef = collection(firebaseDB, "events");
      const data: StoreEventDataType = {
        name: eventData.eventName,
        category: eventData.eventCategory,
        beginDate: Timestamp.fromDate(eventData.eventDate.begin as Date),
        endDate: Timestamp.fromDate(eventData.eventDate.end as Date),
        location: eventData.eventLocation,
        imageCoverUrl: eventCoverUrl || "",
        createdBy: currentUser!.uid,
        manager: null,
        memberUids: [],
        members: [],
        revenueStats: {
          revenueEarned: {
            cdf: 0,
            usd: 0,
          },
          totalExpected: {
            cdf: 0,
            usd: 0,
          },
        },
        ticketCategory: [],
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
                Bravo ! L&apos;événement{" "}
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
    <ProtectedLayout adminOnly>
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
              maxSizeInByte={1024 * 1024 * 5}
            />
          </div>

          {/* btn to cancel and to create an event */}
          <div className="flex items-center justify-between">
            <Button type="button" variant="secondary" link="/dashboard">
              Annuler
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Créer l'événement
            </Button>
          </div>
        </form>
      </main>
    </ProtectedLayout>
  );
};

export default CreateEvent;
