"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues } from "types/Auth";
import { LoginFormValidation } from "validators/authForm";

import { FirebaseError } from "firebase/app";
import { firebaseAuth } from "lib/firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";

import toast from "react-hot-toast";
import AuthForm from "components/AuthForm";
import InputField from "components/FormControls/InputField";

const Login = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  // show error messages in French for email/password login
  const handleLoginError = (error: FirebaseError) => {
    switch (error.code) {
      case "auth/invalid-email":
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Email ou mot de passe incorrect.";
      case "auth/too-many-requests":
        return "Trop de tentatives, veuillez réessayer plus tard.";
      case "auth/network-request-failed":
        return "Une erreur est survenue, vérifiez votre connexion internet.";
      default:
        return error.message;
    }
  };

  // to LOGIN with email and password
  const loginWithEmailAndPassword = async ({
    email,
    password,
  }: LoginFormValues) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      router.push("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof FirebaseError
          ? handleLoginError(error)
          : error instanceof Error
          ? error.message
          : "Une erreur est survenue, veuillez réessayer.";

      toast.error(errorMessage, {
        duration: 5000,
      });
    }
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
          fieldName="email"
          register={register}
          placeholder="Adresse email"
          isAutoFocus={true}
          autoComplete="email"
          errorMessage={errors.email?.message}
        />

        <InputField
          inputType="password"
          fieldName="password"
          register={register}
          placeholder="Mot de passe"
          autoComplete="current-password"
          errorMessage={errors.password?.message}
        />
      </div>
    </AuthForm>
  );
};

export default Login;
