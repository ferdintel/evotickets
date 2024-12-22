import { z, ZodType } from "zod";
import { DefaultCurrencies, GenerateTicketsFormValues } from "types/Tickets";

export const GenerateTicketsFormValidation: ZodType<GenerateTicketsFormValues> =
  z.object({
    ticketCount: z.coerce.number().min(1, "Au moins 1 billet"),

    ticketCategory: z
      .string()
      .trim()
      .min(1, "Précisez une catégorie (Normal, VIP, etc.)"),

    ticketPrice: z.object({
      value: z.coerce.number().min(1, "Le prix commence par 1"),

      currency: z.enum(
        Object.values(DefaultCurrencies) as [
          DefaultCurrencies,
          ...DefaultCurrencies[]
        ],
        {
          errorMap: () => ({ message: "La devise est obligatoire" }),
        }
      ),
    }),
  });
