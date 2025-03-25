import { LuCalendarX2 } from "react-icons/lu";

const FetchDataErrorDisplay = ({ msg }: { msg: string }) => {
  return (
    <div className="mt-4 flex flex-col items-center text-center gap-y-2">
      <span
        className="w-28 h-28 flex items-center justify-center rounded-[2rem] bg-gray-200 
        border border-gray-300"
      >
        <LuCalendarX2 size={48} className="min-w-12 text-error-light" />
      </span>

      <p className="text-lg font-semibold"> Une erreur est survenue: {msg}</p>
      <p className="text-foreground/80 font-medium">
        {!navigator.onLine
          ? "Assurez-vous d&apos;être connecté à internet, puis actualiser la page."
          : "Si l'erreur persiste, veuillez contacter le support."}
      </p>
    </div>
  );
};

export default FetchDataErrorDisplay;
