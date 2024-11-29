type FilledButtonProps = {
  type?: "button" | "submit" | "reset" | undefined;
  children: React.ReactNode;
  addStyles?: string;
};

const FilledButton = ({
  type,
  children,
  addStyles = "",
}: FilledButtonProps) => {
  return (
    <button
      type={type}
      className={`w-full bg-dark font-semibold text-white px-4 py-3 rounded-xl hover:bg-alternate duration-300 ${addStyles}`}
    >
      {children}
    </button>
  );
};

export default FilledButton;
