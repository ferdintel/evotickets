"use client";

import { HTMLInputAutoCompleteAttribute, useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type InputFieldProps<T extends FieldValues> = {
  inputType?: React.HTMLInputTypeAttribute;
  fieldName?: Path<T>;
  register?: UseFormRegister<T>;
  registerOptions?: RegisterOptions<T, Path<T>>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  labelText?: string;
  placeholder?: string;
  addLabelStyles?: string;
  addInputStyles?: string;
  addLabelTextStyles?: string;
  addParentWrapperStyles?: string;
  isAutoFocus?: boolean;
  isRequired?: boolean;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  errorMessage?: string;
};

const InputField = <T extends Record<string, unknown>>({
  inputType = "text",
  fieldName,
  register,
  registerOptions,
  onChange,
  onKeyDown,
  labelText = "",
  placeholder = "",
  addLabelStyles = "",
  addInputStyles = "",
  addLabelTextStyles = "",
  addParentWrapperStyles = "",
  isAutoFocus = false,
  isRequired = true,
  autoComplete,
  errorMessage = "",
}: InputFieldProps<T>) => {
  const [isPassword, setIsPassword] = useState(true);
  const toggle = () => setIsPassword((value) => !value);

  const inputClassName = `w-full px-4 py-3 placeholder:font-medium rounded-lg outline-none border ${
    errorMessage ? "border-error" : "border-gray-300 hover:border-gray-500"
  } focus:shadow-[0_0_0_1px_var(--alternate),0_0_0_3px_inset_var(--alternate-light)] focus:border-alternate duration-300 ${
    inputType === "password" ? "pr-12" : ""
  } ${addInputStyles}`;

  return (
    <div className={`w-full flex flex-col gap-y-1 ${addParentWrapperStyles}`}>
      <label
        className={`relative flex flex-col gap-y-1 ${
          errorMessage &&
          "[--alternate:var(--error)] [--alternate-light:var(--error-light)]"
        } ${addLabelStyles}`}
      >
        {/* label text */}
        {labelText && (
          <span className={`font-medium ${addLabelTextStyles}`}>
            {labelText}
          </span>
        )}

        {/* input and btn to toggle password for input:password */}
        <div className="flex items-center">
          {/* input work with react-hook-form */}
          {register && fieldName ? (
            <input
              type={isPassword ? inputType : "text"}
              {...register(fieldName, registerOptions)}
              name={fieldName}
              placeholder={placeholder}
              autoFocus={isAutoFocus}
              required={isRequired}
              autoComplete={autoComplete}
              className={inputClassName}
            />
          ) : (
            // input without state or react-hook-form
            <input
              type={isPassword ? inputType : "text"}
              name={fieldName}
              placeholder={placeholder}
              autoFocus={isAutoFocus}
              required={isRequired}
              autoComplete={autoComplete}
              className={inputClassName}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
          )}

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
              className="absolute right-2 p-2 text-gray-500 hover:text-alternate duration-300
              outline-alternate rounded-md"
            >
              {isPassword ? <LuEye size={20} /> : <LuEyeOff size={20} />}
            </button>
          )}
        </div>
      </label>

      {/* error message  */}
      {errorMessage && (
        <p className="cursor-default text-xs mb-1 text-error">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputField;
