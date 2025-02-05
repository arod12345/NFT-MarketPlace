import { Link } from "react-router-dom";
import Button from "./Button";

const Navbar = () => {
  return (
    <div className="w-full px-14 py-3 shadow-sm shadow-[#fef3c630] sticky  top-0 flex items-center justify-between bg-[#232323]">
      <Link to="/">
        <img
          src="/logo.png"
          alt="logo"
          className="w-24 h-12 object-cover rounded-md shadow-md shadow-[#dddddd30]"
        />
      </Link>
      <div className="flex items-center w-[45%] justify-between">
        <ul className="flex items-center w-[70%] justify-between text-sm font-bold">
          <li>Home</li>
          <li>My Collections</li>
          <li>Create Collection</li>
        </ul>
        <Button text="Connect" />
      </div>
    </div>
  );
};

export default Navbar;
