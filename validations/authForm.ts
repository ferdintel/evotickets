import { z, ZodType } from "zod";
import { REQUIRED_FIELD_MESSAGE } from "./common";
import { LoginFormValues, RegisterFormValues } from "types/Auth";

const MIN_PASSWORD_SYMBOLS = 8;

export const RegisterFormValidation: ZodType<RegisterFormValues> = z
  .object({
    email: z
      .string()
      .min(1, { message: REQUIRED_FIELD_MESSAGE })
      .email({ message: "Adresse email invalide" }),

    firstName: z
      .string()
      .trim()
      .min(1, { message: REQUIRED_FIELD_MESSAGE })
      .regex(/^[A-Za-zÀ-ÿ '-]+$/, {
        message: "Prénom invalide",
      })
      .transform((val) =>
        val[0].toUpperCase().concat(val.slice(1).toLocaleLowerCase())
      ),

    lastName: z
      .string()
      .trim()
      .min(1, { message: REQUIRED_FIELD_MESSAGE })
      .regex(/^[A-Za-zÀ-ÿ '-]+$/, {
        message: "Nom invalide",
      })
      .transform((val) =>
        val[0].toUpperCase().concat(val.slice(1).toLocaleLowerCase())
      ),

    password: z
      .string()
      .min(1, { message: REQUIRED_FIELD_MESSAGE })
      .min(MIN_PASSWORD_SYMBOLS, {
        message: `Doit avoir au minimum ${MIN_PASSWORD_SYMBOLS} caractères`,
      }),

    confirmPassword: z.string().min(1, { message: REQUIRED_FIELD_MESSAGE }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const LoginFormValidation: ZodType<LoginFormValues> = z.object({
  email: z
    .string()
    .min(1, { message: REQUIRED_FIELD_MESSAGE })
    .email({ message: "Adresse email invalide" }),

  password: z.string().min(1, { message: REQUIRED_FIELD_MESSAGE }),
});
