import AuthForm from "@/app/components/AuthForm";
import InputField from "@/app/components/InputField";

const Login = () => {
  return (
    <AuthForm formType="login">
      <div className="w-full flex flex-col gap-y-2">
        <InputField type="email" name="email" placeholder="Adresse email" isAutoFocus={true} />
        <InputField type="password" name="password" placeholder="Mot de passe" />
      </div>
    </AuthForm>
  );
};

export default Login;
