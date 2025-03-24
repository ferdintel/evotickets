"use client";

import toast from "react-hot-toast";
import Button from "components/Button";
import InputField from "components/FormControls/InputField";

import { useState } from "react";
import { useParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { firebaseAuth } from "lib/firebase/client";
import { SetEventManagerFormValues } from "types/Events";
import { SetEventManagerFormValidation } from "validators/events";
import { FirebaseError } from "firebase/app";

const SetManagerWrapper = () => {
  const params = useParams<{ id: string }>();
  const eventId = params?.id;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SetEventManagerFormValues>({
    resolver: zodResolver(SetEventManagerFormValidation),
    defaultValues: {
      managerEmail: "",
    },
    mode: "onBlur",
  });

  // show and hide wrapper of set manager form
  const [showSetManagerWrapper, setSetShowManagerWrapper] = useState(false);
  const displaySetManagerWrapper = () => setSetShowManagerWrapper(true);
  const hideSetManagerWrapper = () => {
    setSetShowManagerWrapper(false);
    reset();
  };

  // set manager for current event
  const setEventManager = async ({
    managerEmail,
  }: SetEventManagerFormValues) => {
    try {
      const authToken = await firebaseAuth.currentUser?.getIdToken();
      const response = await fetch("/api/events/set-manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ eventId, managerEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        hideSetManagerWrapper();
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
        onClick={displaySetManagerWrapper}
      >
        Définir un manager
      </Button>

      {/* profile and logout buttons */}
      {showSetManagerWrapper && (
        <form
          onSubmit={handleSubmit(setEventManager)}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-80 w-full bg-white rounded-xl p-5
          flex flex-col gap-y-4 shadow-[#00000029_0px_1px_4px,#06182c0d_0px_0px_0px_1px] z-10"
        >
          <InputField
            fieldName="managerEmail"
            inputType="email"
            labelText="Email du futur manager:"
            placeholder="Adresse email du futur manager"
            isAutoFocus={true}
            register={register}
            errorMessage={errors.managerEmail?.message}
          />

          <div className="flex justify-end gap-4">
            <Button
              size="small"
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Définir
            </Button>

            <Button
              size="small"
              variant="secondary"
              type="button"
              onClick={hideSetManagerWrapper}
            >
              Annuler
            </Button>
          </div>
        </form>
      )}

      {/* wrapper to hide form when clicked */}
      {showSetManagerWrapper && (
        <div
          onClick={hideSetManagerWrapper}
          className="bg-dark/50 fixed top-0 left-0 w-screen h-screen z-[5]"
        ></div>
      )}
    </>
  );
};

export default SetManagerWrapper;
