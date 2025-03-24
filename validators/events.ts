import { z, ZodType } from "zod";
import {
  CreateEventFormValues,
  EventMemberRole,
  InviteMemberFormValues,
  SetEventManagerFormValues,
} from "types/Events";
import { defaultEventCategoryValues, REQUIRED_FIELD_MESSAGE } from "./common";

export const CreateEventFormValidation: ZodType<CreateEventFormValues> =
  z.object({
    eventName: z
      .string()
      .trim()
      .min(1, "Le nom de l'événement est obligatoire"),

    eventCategory: z.enum(
      defaultEventCategoryValues as [
        (typeof defaultEventCategoryValues)[number]
      ],
      {
        errorMap: () => ({ message: "La catégorie est obligatoire" }),
      }
    ),

    eventDate: z
      .object({
        begin: z.coerce
          .date()
          .min(new Date(), { message: "La date doit être dans le futur" }),

        end: z.coerce
          .date()
          .min(new Date(), { message: "La date doit être dans le futur" }),
      })
      .refine((data) => data.begin <= data.end, {
        path: ["end"],
        message: "La date de fin doit être postérieure au début",
      }),

    eventLocation: z.string().trim().min(1, "Le lieu est obligatoire"),
  });

export const SetEventManagerFormValidation: ZodType<SetEventManagerFormValues> =
  z.object({
    managerEmail: z
      .string()
      .min(1, REQUIRED_FIELD_MESSAGE)
      .email({ message: "Adresse email invalide" }),
  });

export const InviteMemberFormValidation: ZodType<InviteMemberFormValues> =
  z.object({
    memberEmail: z
      .string()
      .min(1, REQUIRED_FIELD_MESSAGE)
      .email({ message: "Adresse email invalide" }),
    memberRole: z.enum(
      Object.values(EventMemberRole) as [EventMemberRole, ...EventMemberRole[]],
      {
        errorMap: () => ({ message: "le rôle est obligatoire" }),
      }
    ),
  });
