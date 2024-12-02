import { z, ZodType } from "zod";

const MIN_PASSWORD_SYMBOLS = 8;
const REQUIRED_FIELD_MESSAGE = "Champ requis";

export const RegisterFormValidation: ZodType = z
  .object({
    email: z
      .string()
      .regex(/^(?!.*^$).*/, { message: REQUIRED_FIELD_MESSAGE })
      .email({ message: "Adresse email invalide" }),

    firstName: z
      .string()
      .regex(/^(?!.*^$).*/, { message: REQUIRED_FIELD_MESSAGE })
      .regex(/^[A-Za-zÀ-ÿ '-]+$/, {
        message: "Prénom invalide",
      }),

    lastName: z
      .string()
      .regex(/^(?!.*^$).*/, { message: REQUIRED_FIELD_MESSAGE })
      .regex(/^[A-Za-zÀ-ÿ '-]+$/, {
        message: "Nom invalide",
      }),

    password: z
      .string()
      .regex(/^(?!.*^$).*/, { message: REQUIRED_FIELD_MESSAGE })
      .min(MIN_PASSWORD_SYMBOLS, {
        message: `Doit avoir au minimum ${MIN_PASSWORD_SYMBOLS} caractères`,
      }),

    confirmPassword: z
      .string()
      .regex(/^(?!.*^$).*/, { message: REQUIRED_FIELD_MESSAGE }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const LoginFormValidation: ZodType = z.object({
  email: z
    .string()
    .regex(/^(?!.*^$).*/, { message: REQUIRED_FIELD_MESSAGE })
    .email({ message: "Adresse email invalide" }),

  password: z
    .string()
    .regex(/^(?!.*^$).*/, { message: REQUIRED_FIELD_MESSAGE })
    .min(MIN_PASSWORD_SYMBOLS, {
      message: `Doit avoir au minimum ${MIN_PASSWORD_SYMBOLS} caractères`,
    }),
});
