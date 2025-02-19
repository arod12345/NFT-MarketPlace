import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MdLinkOff } from "react-icons/md";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content Area */}
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <MdLinkOff className="text-9xl text-[#ff0000] mb-4" />
        <div className="p-4 bg-red-100 text-red-600"> Page Not Found 404 </div>
        <Link
          to="/"
          className="text-blue-400 mt-4 p-4 rounded border-[.1px] border-[#ffffff30]"
        >
          return Home
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default PageNotFound;
