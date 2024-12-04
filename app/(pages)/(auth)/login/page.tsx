"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues } from "types/Auth";
import { LoginFormValidation } from "validations/authForm";

import { FirebaseError } from "firebase/app";
import { firebaseAuth } from "lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import toast from "react-hot-toast";
import AuthForm from "components/AuthForm";
import InputField from "components/FormControls/InputField";

import { IoIosCloseCircle } from "react-icons/io";

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
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
      const user = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      // show welcome message
      toast.success(
        (t) => (
          <div className="flex items-start justify-between gap-x-3">
            <p>
              <span
                className="font-bold bg-gradient-to-bl from-accent via-alternate
                to-accent bg-clip-text text-transparent leading-normal"
              >
                Bienvenue, {JSON.stringify(user)} !
              </span>{" "}
              Nous sommes content de vous revoir.
            </p>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-slate-400 hover:text-alternate duration-300"
            >
              <IoIosCloseCircle size={30} />
            </button>
          </div>
        ),
        { duration: 5000, icon: "🎉", style: { paddingRight: "0px" } }
      );
    } catch (err) {
      if (err instanceof FirebaseError) {
        const errorMessageInFrench = handleLoginError(err);
        toast.error(errorMessageInFrench, {
          duration: 5000,
        });
      }
    }
  };

  return (
    <AuthForm
      formType="login"
      handleSubmit={handleSubmit(loginWithEmailAndPassword)}
      formIsSubmitting={isSubmitting}
      formIsValid={isValid}
    >
      <div className="w-full flex flex-col gap-y-2">
        <InputField
          inputType="email"
          name="email"
          register={register}
          placeholder="Adresse email"
          isAutoFocus={true}
          autoComplete="email"
          errorMessage={errors.email && errors.email.message}
        />

        <InputField
          inputType="password"
          name="password"
          register={register}
          placeholder="Mot de passe"
          autoComplete="current-password"
          errorMessage={errors.password && errors.password.message}
        />
      </div>
    </AuthForm>
  );
};

export default Login;
