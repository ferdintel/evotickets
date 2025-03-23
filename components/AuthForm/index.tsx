"use client";

import { useState } from "react";

import Link from "next/link";
import Image from "next/image";
import Checkbox from "components/FormControls/Checkbox";
import Button from "@/components/Button";
import PublicRoute from "@/components/PublicRoute";

type AuthFormProps = {
  formType: "login" | "register";
  children: React.ReactNode;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  formIsSubmitting: boolean;
};

const AuthForm = ({
  formType,
  children,
  handleSubmit,
  formIsSubmitting,
}: AuthFormProps) => {
  // to toggle button to submit when checked terms of use
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const toggleIsTermsAccepted = () =>
    setIsTermsAccepted((prevState) => !prevState);

  return (
    <div className="grow py-8 flex justify-center items-center">
      <div className="max-w-md w-full bg-white flex flex-col justify-center items-center px-6 py-6 rounded-xl shadow">
        <div>
          <Image
            src="/images/site-logos/logo-evotickets-dark.png"
            width={200}
            height={40}
            alt="evotickets logo"
            priority={true}
            className="max-w-48 h-auto object-contain"
          />
        </div>

        {/* title */}
        <h2 className="text-lg font-semibold mt-6 mb-4">
          {formType === "login" ? "Connexion" : "Inscrivez-vous dès maintenant"}
        </h2>

        {/* form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          {/* form inputs */}
          {children}

          {/* terms of use and privacy policy */}
          {formType === "register" && (
            <Checkbox
              name="termsOfService"
              isChecked={isTermsAccepted}
              handleOnChange={toggleIsTermsAccepted}
              addStyles="mt-4 rounded-md py-1.5 px-3 hover:bg-gray-200 duration-300"
            >
              <p className="text-[13px] text-foreground/80">
                En vous inscrivant, vous acceptez nos{" "}
                <Link
                  href="#"
                  className="text-foreground/90 font-semibold underline hover:no-underline duration-300"
                >
                  Conditions Générales d&apos;Utilisation
                </Link>
                , et déclarez avoir pris connaissance de notre{" "}
                <Link
                  href="#"
                  className="text-foreground/90 font-semibold underline hover:no-underline duration-300"
                >
                  Politique de Confidentialité
                </Link>
                .
              </p>
            </Checkbox>
          )}

          {/* btn to submit form */}
          <Button
            type="submit"
            addStyles="mt-4"
            isLoading={formIsSubmitting}
            disabled={
              (formType === "register" && !isTermsAccepted) || formIsSubmitting
            }
          >
            {formType === "login" ? "Se connecter" : "S'inscrire"}
          </Button>
        </form>

        <p className="mt-4 text-center">
          <span className="">
            {formType === "login"
              ? "Vous n'avez pas de compte ? "
              : "Vous avez déjà un compte ? "}
          </span>

          <Link
            className="font-semibold text-nowrap hover:text-alternate duration-300"
            href={formType === "login" ? "/register" : "/login"}
          >
            {formType === "login" ? "Créer un compte" : "Connectez-vous"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PublicRoute(AuthForm);
