"use client";

import Image from "next/image";
import Link from "next/link";
import FilledButton from "../FilledButton";

type AuthFormProps = {
  formType: "login" | "register";
  children: React.ReactNode;
};

const AuthForm = ({ formType, children }: AuthFormProps) => {
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    console.log("formData:", formData);
  };

  return (
    <div className="px-4 mobileM:px-5 min-h-screen flex justify-center items-center pt-8 pb-6 bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-[380px] w-full bg-white flex flex-col justify-center items-center px-6 pt-6 pb-4 rounded-xl shadow"
      >
        <Link href="/" className="hover:opacity-80 duration-300">
          <Image
            src="/images/site-logos/logo-evotickets-dark.png"
            width={200}
            height={200}
            alt="evotickets logo"
          />
        </Link>

        <h2 className="text-xl font-bold mt-6 mb-4">
          {formType === "login" ? "Connexion" : "Inscription"}
        </h2>

        {/* form inputs */}
        {children}

        <FilledButton type="submit" addStyles="mt-4">
          {formType === "login" ? "Se connecter" : "S'inscrire"}
        </FilledButton>

        <p className="mt-4 text-center">
          <span className="">
            {formType === "login"
              ? "Vous n'avez pas de compte ? "
              : "Vous avez déjà un compte ? "}
          </span>

          <Link
            className="font-bold text-nowrap hover:text-alternate duration-300"
            href={formType === "login" ? "/register" : "/login"}
          >
            {formType === "login" ? "Créer un compte" : "Connectez-vous"}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
