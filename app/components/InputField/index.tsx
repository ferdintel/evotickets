type InputFieldProps = {
  type?: React.HTMLInputTypeAttribute;
  name: string;
  placeholder?: string;
  addStyles?: string;
  isAutoFocus?: boolean;
  isRequired?: boolean;
};

const InputField = ({
  type = "text",
  name = "",
  placeholder = "",
  addStyles = "",
  isAutoFocus = false,
  isRequired = true,
}: InputFieldProps) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      autoFocus={isAutoFocus}
      required={isRequired}
      className={`w-full px-4 py-3 placeholder:font-medium outline-none border border-slate-300
      rounded-xl hover:border-alternate focus:border-alternate hover:shadow-[0_0_0_1px_var(--alternate)]
      focus:shadow-[0_0_0_1px_var(--alternate)] duration-300 ${addStyles}`}
    />
  );
};

export default InputField;
