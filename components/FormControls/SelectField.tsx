import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

import { LuChevronDown } from "react-icons/lu";

type SelectOption = {
  text: string;
  value: string;
};

type SelectFieldProps<T extends FieldValues> = {
  fieldName: Path<T>;
  selectOptions: SelectOption[];
  register: UseFormRegister<T>;
  registerOptions?: RegisterOptions<T, Path<T>>;
  labelText?: string;
  addLabelStyles?: string;
  addSelectStyles?: string;
  addLabelTextStyles?: string;
  addParentWrapperStyles?: string;
  isAutoFocus?: boolean;
  isRequired?: boolean;
  errorMessage?: string;
};
const SelectField = <T extends Record<string, unknown>>({
  fieldName,
  selectOptions,
  register,
  registerOptions,
  labelText = "",
  addLabelStyles = "",
  addSelectStyles = "",
  addLabelTextStyles = "",
  addParentWrapperStyles = "",
  isAutoFocus = false,
  isRequired = false,
  errorMessage = "",
}: SelectFieldProps<T>) => {
  return (
    <div className={`w-full flex flex-col gap-y-1 ${addParentWrapperStyles}`}>
      <label
        className={`relative flex flex-col gap-y-1 
        ${
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

        {/* select and down arrow */}
        <div className="flex items-center">
          <select
            {...register(fieldName, registerOptions)}
            name={fieldName}
            autoFocus={isAutoFocus}
            required={isRequired}
            className={`w-full px-4 py-3 placeholder:font-medium rounded-lg outline-none border peer
            ${
              errorMessage
                ? "border-error"
                : "border-gray-300 hover:border-gray-500"
            }
            focus:shadow-[0_0_0_1px_var(--alternate),0_0_0_3px_inset_var(--alternate-light)]
            focus:border-alternate duration-300 pr-12 ${addSelectStyles}`}
          >
            <option
              value=""
              defaultValue=""
              disabled
              className="font-medium text-gray-400"
            >
              Sélectionnez une option
            </option>

            {selectOptions.map((selectOption) => (
              <option key={selectOption.value} value={selectOption.value}>
                {selectOption.text}
              </option>
            ))}
          </select>

          {/* down arrow */}
          <span
            className={`absolute right-2 text-gray-400 peer-hover:text-gray-500
            peer-focus:text-alternate peer-focus-within:rotate-180 duration-300 pointer-events-none`}
          >
            <LuChevronDown size={24} />
          </span>
        </div>
      </label>

      {/* error message  */}
      {errorMessage && (
        <p className="cursor-default text-xs mb-1 text-error">{errorMessage}</p>
      )}
    </div>
  );
};

export default SelectField;
