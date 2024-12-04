type FilledButtonProps = {
  type?: "button" | "submit" | "reset" | undefined;
  children: React.ReactNode;
  addStyles?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const FilledButton = ({
  type,
  children,
  addStyles = "",
  disabled = false,
  onClick,
}: FilledButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`bg-dark font-semibold text-white px-4 py-3 rounded-xl select-none
      text-nowrap hover:bg-alternate active:shadow-[0_0_0_2px_inset_var(--dark)]
      focus:shadow-[0_0_0_2px_inset_var(--alternate)] disabled:bg-slate-200
      disabled:text-foreground/50 disabled:shadow-[0_0_0_1px_inset_#94a3b8]
      disabled:cursor-not-allowed duration-300 ${addStyles}`}
    >
      {children}
    </button>
  );
};

export default FilledButton;
