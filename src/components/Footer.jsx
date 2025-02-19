import { Link } from "react-router-dom";
import { FaDiscord, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#141414] border-t-[.1px] border-[#ffffff20]  text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Logo & Description */}
          <div>
            <img src="/logo.png" alt="logo" className="h-12  mx-auto md:mx-0" />
            <p className="text-gray-400 mt-2">
              Discover, collect, and sell extraordinary NFTs securely.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-400">
                  Explore
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-blue-400">
                  Create NFT
                </Link>
              </li>
              <li>
                <Link to="/purchased" className="hover:text-blue-400">
                  My Collection
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400">
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="mt-2 flex justify-center md:justify-start space-x-4">
              <a href="#" className="hover:text-blue-400">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="#" className="hover:text-blue-400">
                <FaDiscord className="text-2xl" />
              </a>
              <a href="#" className="hover:text-blue-400">
                <FaInstagram className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} NFT Marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
