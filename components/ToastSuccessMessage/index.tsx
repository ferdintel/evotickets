import toast from "react-hot-toast";
import { IoIosCloseCircle } from "react-icons/io";

type ToastSuccessMessageProps = {
  toastId: string;
  children: React.ReactNode;
};

const ToastSuccessMessage = ({ toastId, children }: ToastSuccessMessageProps) => {
  return (
    <div className="flex items-start justify-between gap-x-3">
      {children}

      <button
        onClick={() => toast.dismiss(toastId)}
        className="text-gray-400 hover:text-alternate duration-300"
      >
        <IoIosCloseCircle size={30} />
      </button>
    </div>
  );
};

export default ToastSuccessMessage;
