"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValues } from "types/Auth";
import { RegisterFormValidation } from "validations/authForm";

import { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import { firebaseAuth, firestoreDB } from "lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import toast from "react-hot-toast";
import AuthForm from "components/AuthForm";
import InputField from "components/FormControls/InputField";

import { IoIosCloseCircle } from "react-icons/io";

const Register = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterFormValidation),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  // show error messages in French for email/password registration
  const handleRegisterError = (error: FirebaseError) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Cette adresse email est déjà utilisée.";
      case "auth/too-many-requests":
        return "Trop de tentatives, veuillez réessayer plus tard.";
      case "auth/network-request-failed":
        return "Une erreur est survenue, vérifiez votre connexion internet.";
      default:
        return error.message;
    }
  };

  // to REGISTER user with email/password
  const registerWithEmailAndPassword = async ({
    email,
    password,
    firstName,
    lastName,
  }: RegisterFormValues) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      // add user infos for registered user to 'users' collection
      const docRef = doc(firestoreDB, "users", userCredential.user.uid);
      const data = { firstName, lastName };
      await setDoc(docRef, data);

      // show success message
      toast.success(
        (t) => (
          <div className="flex items-start justify-between gap-x-3">
            <p>
              <span
                className="font-bold bg-gradient-to-bl from-accent via-alternate
                      to-accent bg-clip-text text-transparent leading-normal"
              >
                Félicitations, {firstName} !
              </span>{" "}
              Votre compte a été créé avec succès.
            </p>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-slate-400 hover:text-alternate duration-300"
            >
              <IoIosCloseCircle size={30} />
            </button>
          </div>
        ),
        { duration: 8000, icon: "🎉", style: { paddingRight: "0px" } }
      );
    } catch (err) {
      if (err instanceof FirebaseError) {
        const errorMessageInFrench = handleRegisterError(err);
        toast.error(errorMessageInFrench, {
          duration: 5000,
        });
      }
    }
  };

  return (
    <AuthForm
      formType="register"
      handleSubmit={handleSubmit(registerWithEmailAndPassword)}
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
