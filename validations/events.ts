import { z, ZodType } from "zod";
import { CreateEventFormValues, EventCategory } from "types/Events";
import { eventCategoryValues } from "./common";

export const CreateEventFormValidation: ZodType<CreateEventFormValues> =
  z.object({
    eventName: z.string().min(1, "Le nom de l'événement est obligatoire"),

    eventCategory: z.enum(
      eventCategoryValues as [(typeof eventCategoryValues)[number]],
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

    eventPlace: z.string().min(1, "Le lieu est obligatoire"),
  });
