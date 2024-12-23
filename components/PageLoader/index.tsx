import { BiLoaderCircle } from "react-icons/bi";

const PageLoader = () => {
  return (
    <div className="grow py-8 flex justify-center items-center">
      <span className="animate-spin text-alternate">
        <BiLoaderCircle size={24} />
      </span>
    </div>
  );
};

export default PageLoader;
