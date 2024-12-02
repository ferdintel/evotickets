"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValues } from "types/Auth";
import { RegisterFormValidation } from "validations/authForm";

import AuthForm from "components/AuthForm";
import InputField from "components/FormControls/InputField";

const Register = () => {
  const { handleSubmit, register, formState } = useForm<RegisterFormValues>({
    resolver:zodResolver(RegisterFormValidation),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
    },
    mode: "onTouched"
  });

  const { errors, isSubmitting } = formState;

  // to REGISTER user with email/password
  const registerWithEmailAndPassword = async (data: RegisterFormValues) => {
    console.log(data);
  };

  return (
    <AuthForm
      formType="register"
      handleSubmit={handleSubmit(registerWithEmailAndPassword)}
      formIsSubmitting={isSubmitting}
    >
      <div className="w-full flex flex-col gap-y-2">
        <InputField
          inputType="email"
          name="email"
          register={register}
          placeholder="Adresse email"
          isAutoFocus={true}
          errorMessage={errors.email && errors.email.message}
        />

        <div className="flex gap-x-2">
          <InputField
            name="firstName"
            register={register}
            placeholder="Prénom"
            errorMessage={errors.firstName && errors.firstName.message}
          />

          <InputField
            name="lastName"
            register={register}
            placeholder="Nom"
            errorMessage={errors.lastName && errors.lastName.message}
          />
        </div>

        <InputField
          inputType="password"
          name="password"
          register={register}
          placeholder="Mot de passe"
          errorMessage={errors.password && errors.password.message}
        />

        <InputField
          inputType="password"
          name="confirmPassword"
          register={register}
          placeholder="Confirmer le mot de passe"
          errorMessage={
            errors.confirmPassword && errors.confirmPassword.message
          }
        />
      </div>
    </AuthForm>
  );
};

export default Register;
