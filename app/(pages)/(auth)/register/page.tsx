import AuthForm from "@/app/components/AuthForm";
import InputField from "@/app/components/InputField";

const Register = () => {
  return (
    <AuthForm formType="register">
      <div className="w-full flex flex-col gap-y-2">
        <InputField
          name="firstName"
          placeholder="Prénom"
          isAutoFocus={true}
        />

        <InputField
          name="lastName"
          placeholder="Nom"
        />

        <InputField
          type="email"
          name="email"
          placeholder="Adresse email"
        />

        <InputField
          type="password"
          name="password"
          placeholder="Mot de passe"
        />

        <InputField
          type="password"
          name="confirmPassword"
          placeholder="Confirmer le mot de passe"
        />
      </div>
    </AuthForm>
  );
};

export default Register;
