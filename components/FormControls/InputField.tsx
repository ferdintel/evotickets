"use client";

import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type InputFieldProps<T extends FieldValues> = {
  inputType?: React.HTMLInputTypeAttribute;
  name: Path<T>;
  register: UseFormRegister<T>;
  registerOptions?: RegisterOptions<T, Path<T>>;
  placeholder: string;
  addStyles?: string;
  isAutoFocus?: boolean;
  isRequired?: boolean;
  errorMessage?: string;
};

const InputField = <T extends Record<string, unknown>>({
  inputType = "text",
  name,
  register,
  registerOptions,
  placeholder = "",
  addStyles = "",
  isAutoFocus = false,
  isRequired = true,
  errorMessage = "",
}: InputFieldProps<T>) => {
  const [isPassword, setIsPassword] = useState(true);
  const toggle = () => setIsPassword((value) => !value);

  return (
    <div className="flex flex-col gap-y-1">
      <label className="relative flex items-center">
        <input
          type={isPassword ? inputType : "text"}
          {...register(name, registerOptions )}
          name={name}
          placeholder={placeholder}
          autoFocus={isAutoFocus}
          required={isRequired}
          className={`w-full px-4 py-3 placeholder:font-medium outline-none border border-slate-300 rounded-xl
          hover:border-alternate focus:border-alternate focus:shadow-[0_0_0_1px_var(--alternate),0_0_0_3px_inset_var(--alternate-light)]
          duration-300 ${inputType === "password" && "pr-12"} ${addStyles}`}
        />

        {/* for input:password */}
        {inputType === "password" && (
          <button
            type="button"
            title={
              isPassword
                ? "Afficher le mot de passe"
                : "Masquer le mot de passe"
            }
            onClick={toggle}
            className="absolute right-2 p-2 text-slate-500 hover:text-alternate duration-300 outline-alternate rounded-md"
          >
            {isPassword ? <LuEye size={20} /> : <LuEyeOff size={20} />}
          </button>
        )}
      </label>

      {errorMessage && (
        <p className="ml-1 cursor-default text-xs mb-1 text-[#dc0e40]">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default InputField;
