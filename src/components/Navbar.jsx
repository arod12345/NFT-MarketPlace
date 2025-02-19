import { Link } from "react-router-dom";
import Button from "./Button";
import { useContext, useState } from "react";
import AppContext from "../context/Context";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { web3Handler, account } = useContext(AppContext);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="w-full bg-[#131313] px-4 sm:px-14 py-2 border-b-[0.1px] border-[#ffffff30] sticky top-0 flex items-center justify-between z-50">
      <Link to="/">
        <img
          src="/logo.png"
          alt="logo"
          className="w-16 sm:w-20 h-8 sm:h-10 object-cover rounded-md shadow-md shadow-[#dddddd30]"
        />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center w-[50%] justify-between text-sm font-bold">
        <Link to="/purchased" className="hover:text-blue-400 transition-colors">
          <li>My Purchases</li>
        </Link>
        <Link to="/listed" className="hover:text-blue-400 transition-colors">
          <li>My Listings</li>
        </Link>
        <Link to="/create" className="hover:text-blue-400 transition-colors">
          <li>Create Collection</li>
        </Link>
        {account ? (
          <a
            href={`https://etherscan.io/address/${account}`}
            target="_blank"
            rel="noopener noreferrer"
            className="button nav-button btn-sm mx-4"
          >
            <Button
              text={account.slice(0, 5) + "..." + account.slice(38, 42)}
            />
          </a>
        ) : (
          <Button event={web3Handler} text="Connect Wallet" />
        )}
      </ul>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="text-white focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#131313] transition-transform duration-300 ease-in-out transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden z-40`}
      >
        <div className="flex flex-col p-4">
          <button
            onClick={toggleMobileMenu}
            className="self-end mb-4 text-white"
          >
            <FaTimes className="w-6 h-6" />
          </button>
          <ul className="flex flex-col space-y-4">
            <Link
              to="/purchased"
              className="text-white hover:text-blue-400 transition-colors"
              onClick={toggleMobileMenu}
            >
              <li>My Purchases</li>
            </Link>
            <Link
              to="/listed"
              className="text-white hover:text-blue-400 transition-colors"
              onClick={toggleMobileMenu}
            >
              <li>My Listings</li>
            </Link>
            <Link
              to="/create"
              className="text-white hover:text-blue-400 transition-colors"
              onClick={toggleMobileMenu}
            >
              <li>Create Collection</li>
            </Link>
            {account ? (
              <a
                href={`https://etherscan.io/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4"
              >
                <Button
                  text={account.slice(0, 5) + "..." + account.slice(38, 42)}
                  fullWidth
                />
              </a>
            ) : (
              <div className="mt-4">
                <Button
                  event={() => {
                    web3Handler();
                    toggleMobileMenu();
                  }}
                  text="Connect Wallet"
                  fullWidth
                />
              </div>
            )}
          </ul>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[#13131380] bg-opacity-50 z-30 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </div>
  );
};

export default Navbar;