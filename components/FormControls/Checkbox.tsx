import { PiCheckFatFill } from "react-icons/pi";

type CheckboxProps = {
  name: string;
  children: React.ReactNode;
  isRequired?: boolean;
  isChecked?: boolean;
  handleOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addStyles?: string;
};

const Checkbox = ({
  name = "",
  children,
  addStyles = "",
  isRequired = true,
  handleOnChange,
  isChecked = false,
}: CheckboxProps) => {
  return (
    <label
      className={`relative flex items-center gap-x-4 cursor-pointer group ${addStyles}`}
    >
      {handleOnChange ? (
        // stateful
        <input
          type="checkbox"
          name={name}
          required={isRequired}
          checked={isChecked}
          onChange={handleOnChange}
          className="absolute opacity-0 scale-0 peer"
        />
      ) : (
        // stateless
        <input
          type="checkbox"
          name={name}
          required={isRequired}
          className="absolute opacity-0 scale-0 peer"
        />
      )}

      {/* check icon */}
      <span
        className="min-w-5 min-h-5 bg-background text-transparent rounded-md border-2 border-gray-400
        group-hover:border-alternate group-hover:shadow-[0_0_0_4px_#d19fd599] peer-checked:bg-alternate
        peer-checked:border-alternate peer-checked:text-white peer-focus:border-alternate
        peer-focus:shadow-[0_0_0_4px_#d19fd599] duration-300 ease-out"
      >
        <PiCheckFatFill size={16} />
      </span>

      {children}
    </label>
  );
};

export default Checkbox;
