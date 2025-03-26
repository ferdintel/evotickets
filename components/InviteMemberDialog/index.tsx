"use client";

import toast from "react-hot-toast";
import Button from "components/Button";
import InputField from "components/FormControls/InputField";
import SelectField from "components/FormControls/SelectField";

import { useState } from "react";
import { useParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { firebaseAuth } from "lib/firebase/client";
import { EventMemberRole, InviteMemberFormValues } from "types/Events";
import { InviteMemberFormValidation } from "validators/events";
import { FirebaseError } from "firebase/app";
import ClientPortal from "../ClientPortal";

const InviteMemberDialog = () => {
  const params = useParams<{ id: string }>();
  const eventId = params?.id;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberFormValues>({
    resolver: zodResolver(InviteMemberFormValidation),
    defaultValues: {
      memberEmail: "",
      memberRole: EventMemberRole.VENDOR,
    },
    mode: "onBlur",
  });

  // show and hide dialog
  const [showDialog, setShowDialog] = useState(false);
  const displayDialog = () => setShowDialog(true);
  const hideDialog = () => {
    setShowDialog(false);
    reset();
  };

  // invite member
  const inviteMember = async ({
    memberEmail,
    memberRole,
  }: InviteMemberFormValues) => {
    try {
      const authToken = await firebaseAuth.currentUser?.getIdToken();
      const response = await fetch("/api/invitations/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ eventId, memberEmail, memberRole }),
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
      <Button size="small" onClick={displayDialog} addStyles="self-center">
        Invitez un membre de votre équipe
      </Button>

      {/* profile and logout buttons */}
      {showDialog && (
        <ClientPortal>
          <form
            onSubmit={handleSubmit(inviteMember)}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-80 w-full bg-white rounded-xl p-5
            flex flex-col gap-y-4 shadow z-10"
          >
            <div className="flex flex-col gap-y-2">
              <InputField
                fieldName="memberEmail"
                inputType="email"
                labelText="Email du membre à inviter"
                placeholder="Email du membre à inviter"
                isAutoFocus={true}
                register={register}
                errorMessage={errors.memberEmail?.message}
              />

              <SelectField
                fieldName="memberRole"
                labelText="Rôle"
                placeholder="Sélectionnez un rôle"
                register={register}
                selectOptions={[
                  { text: "Vendeur", value: EventMemberRole.VENDOR },
                  { text: "Contrôleur", value: EventMemberRole.CONTROLLER },
                ]}
                errorMessage={errors.memberRole?.message}
              />
            </div>

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
                onClick={hideDialog}
              >
                Annuler
              </Button>
            </div>
          </form>

          {/* wrapper to hide dialog form when clicked */}

          <div
            onClick={hideDialog}
            className="bg-dark/50 fixed top-0 left-0 w-screen h-screen z-[5]"
          ></div>
        </ClientPortal>
      )}
    </>
  );
};

export default InviteMemberDialog;
