import { Link } from "react-router-dom";
import Button from "./Button";
import { useContext } from "react";
import AppContext from "../context/Context";

const Navbar = () => {
  const { web3Handler, account } = useContext(AppContext);

  return (
    <div className="w-full bg-[#131313] px-14 py-2 border-b-[0.1px] border-[#ffffff30] sticky  top-0 flex items-center justify-between">
      <Link to="/">
        <img
          src="/logo.png"
          alt="logo"
          className="w-24 h-12 object-cover rounded-md shadow-md shadow-[#dddddd30]"
        />
      </Link>

      <ul className="flex items-center w-[40%] justify-between text-sm font-bold">
        <Link to="/Mycollections">
          <li>My Collections</li>
        </Link>
        <Link to="/create">
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
    </div>
  );
};

export default Navbar;
