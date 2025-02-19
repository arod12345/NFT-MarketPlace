import Navbar from "./Navbar";
import Footer from "./Footer";
import { MdLinkOff } from "react-icons/md";

const Error = ({ message }) => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content Area */}
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <MdLinkOff className="text-9xl text-[#ff0000] mb-4" />
        <div className="p-4 bg-red-100 text-red-600">{message}</div>
      </div>

      <Footer />
    </div>
  );
};

export default Error;
