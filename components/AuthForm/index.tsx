"use client";

import Link from "next/link";
import Image from "next/image";
import PageLoader from "components/PageLoader";
import Checkbox from "components/FormControls/Checkbox";
import FilledButton from "components/FilledButton";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector } from "lib/store/hooks";
import { selectAuth } from "lib/store/slices/authSlice";

import { BiLoaderCircle } from "react-icons/bi";

type AuthFormProps = {
  formType: "login" | "register";
  children: React.ReactNode;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  formIsSubmitting: boolean;
  formIsValid: boolean;
};

const AuthForm = ({
  formType,
  children,
  handleSubmit,
  formIsSubmitting,
  formIsValid,
}: AuthFormProps) => {
  // to toggle button to submit when checked terms of use
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const toggleIsTermsAccepted = () =>
    setIsTermsAccepted((prevState) => !prevState);

  // to redirect user to dashboard if is authenticated
  const router = useRouter();
  const auth = useAppSelector(selectAuth);
  useEffect(() => {
    if (!auth.pending && auth.currentUser) router.push("/dashboard");
  }, [auth]);

  if (auth.pending) return <PageLoader />;

  if (auth.currentUser === null)
    return (
      <div className="px-4 mobileM:px-5 min-h-screen flex justify-center items-center pt-8 pb-6 bg-gray-100">
        <div
          className="max-w-[380px] w-full bg-white flex flex-col justify-center items-center px-6 py-6
          rounded-xl shadow"
        >
          <Link href="/" className="hover:opacity-80 duration-300">
            <Image
              src="/images/site-logos/logo-evotickets-dark.png"
              width={200}
              height={40}
              priority={true}
              alt="evotickets logo"
              className="max-w-48 h-auto object-contain"
            />
          </Link>

          {/* title */}
          <h2 className="text-lg font-bold mt-6 mb-4">
            {formType === "login"
              ? "Connexion"
              : "Inscrivez-vous dès maintenant"}
          </h2>

          {/* form */}
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* form inputs */}
            {children}

            {/* terms of use and privacy policy */}
            {formType === "register" && (
              <Checkbox
                name="termsOfService"
                isChecked={isTermsAccepted}
                handleOnChange={toggleIsTermsAccepted}
                addStyles="mt-4 hover:bg-gray-100 rounded-md p-2 duration-300"
              >
                <p className="text-[13px] text-foreground/80">
                  En vous inscrivant, vous acceptez nos{" "}
                  <Link
                    href="#"
                    className="text-foreground/90 underline hover:no-underline duration-300"
                  >
                    Conditions Générales d&apos;Utilisation
                  </Link>
                  , et déclarez avoir pris connaissance de notre{" "}
                  <Link
                    href="#"
                    className="text-foreground/90 underline hover:no-underline duration-300"
                  >
                    Politique de Confidentialité
                  </Link>
                  .
                </p>
              </Checkbox>
            )}

            <FilledButton
              type="submit"
              addStyles="mt-4 flex items-center justify-between gap-x-3"
              disabled={
                (formType === "register" && !isTermsAccepted) ||
                !formIsValid ||
                formIsSubmitting
              }
            >
              <span className="w-full">
                {formType === "login" ? "Se connecter" : "S'inscrire"}
              </span>

              {formIsSubmitting && (
                <span className="animate-spin text-dark/50">
                  <BiLoaderCircle size={20} />
                </span>
              )}
            </FilledButton>
          </form>

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
        </div>
      </div>
    );
  else return <PageLoader />;
};

export default AuthForm;
