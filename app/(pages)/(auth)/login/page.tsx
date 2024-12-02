"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormValues } from "types/Auth";
import { LoginFormValidation } from "validations/authForm";

import AuthForm from "components/AuthForm";
import InputField from "components/FormControls/InputField";

const Login = () => {
  const { handleSubmit, register, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const { errors, isSubmitting } = formState;

  // to LOGIN with email and password
  const loginWithEmailAndPassword = async (data: LoginFormValues) => {
    console.log(data);
  };

  return (
    <AuthForm
      formType="login"
      handleSubmit={handleSubmit(loginWithEmailAndPassword)}
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

        <InputField
          inputType="password"
          name="password"
          register={register}
          placeholder="Mot de passe"
          errorMessage={errors.password && errors.password.message}
        />
      </div>
    </AuthForm>
  );
};

export default Login;
