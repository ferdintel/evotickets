import Link from "next/link";
import { BiLoaderCircle } from "react-icons/bi";

type FilledButtonProps = {
  type?: "button" | "submit" | "reset" | undefined;
  children: React.ReactNode;
  addStyles?: string;
  disabled?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
  variant?: "primary" | "slate";
  link?: string;
};

const FilledButton = ({
  type,
  children,
  addStyles = "",
  disabled = false,
  onClick,
  isLoading = false,
  variant = "primary",
  link = "",
}: FilledButtonProps) => {
  const commonStyles =
    "flex items-center justify-center gap-x-4 font-semibold px-4 py-3 rounded-lg text-nowrap select-none disabled:bg-slate-200 disabled:text-foreground/50 disabled:shadow-[0_0_0_1px_inset_#94a3b8] disabled:cursor-not-allowed duration-300";
  const variantPrimaryStyles =
    "bg-alternate/90 text-white hover:bg-alternate focus:bg-alternate focus:shadow-[0px_0px_0px_3px_inset_var(--alternate-light)]";
  const variantSlateStyles =
    "bg-[#00000012] text-foreground/90 hover:bg-[#0000001f] focus:bg-[#0000001f] focus:shadow-[0px_0px_0px_3px_inset_#1111112b]";

  return (
    <>
      {link ? (
        <Link
          href={link}
          className={`${commonStyles} 
          ${variant === "primary" ? variantPrimaryStyles : variantSlateStyles} 
          ${addStyles}`}
        >
          {children}
        </Link>
      ) : (
        <button
          type={type}
          disabled={disabled}
          onClick={onClick}
          className={`${commonStyles} 
          ${variant === "primary" ? variantPrimaryStyles : variantSlateStyles} 
          ${addStyles}`}
        >
          {children}
          {isLoading && (
            <span className="animate-spin text-dark/50">
              <BiLoaderCircle size={20} />
            </span>
          )}
        </button>
      )}
    </>
  );
};

export default FilledButton;
