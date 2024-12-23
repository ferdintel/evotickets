"use client";

import Link from "next/link";
import { BiLoaderCircle } from "react-icons/bi";

type FilledButtonProps = {
  type?: "button" | "submit" | "reset" | undefined;
  children: React.ReactNode;
  link?: string;
  addStyles?: string;
  disabled?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
  variant?: "primary" | "slate";
  size?: "normal" | "small";
};

const FilledButton = ({
  type,
  children,
  link = "",
  addStyles = "",
  disabled = false,
  onClick,
  isLoading = false,
  variant = "primary",
  size = "normal",
}: FilledButtonProps) => {
  const commonStyles = `flex items-center justify-center gap-x-4 font-semibold ${
    size === "normal" ? "px-4 py-3" : "px-3 py-2 text-sm"
  } rounded-lg text-nowrap select-none disabled:bg-gray-200 disabled:text-foreground/50 disabled:shadow-[0_0_0_1px_inset_#94a3b8] disabled:cursor-not-allowed duration-300`;

  const variantPrimaryStyles =
    "bg-alternate/90 text-white hover:bg-alternate focus:bg-alternate focus:shadow-[0px_0px_0px_3px_inset_var(--alternate-light)]";

  const variantSlateStyles =
    "bg-[#00000012] text-foreground/80 shadow-[0px_0px_0px_1px_inset_#9ca3af] hover:bg-[#0000001f] focus:bg-[#0000001f] focus:shadow-[0px_0px_0px_3px_inset_#1111112b]";

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
