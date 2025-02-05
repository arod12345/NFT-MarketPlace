import Panda from "../assets/ape.jpg";
import Button from "./Button";
import { Link } from "react-router-dom";

const Card = () => {
  return (
    <div className="flex overflow-hidden flex-col w-[18em] h-[22em] items-center mb-[10px] justify-between p-2 bg-[#00003350] rounded-lg shadow-lg shadow-[#fef3c615]">
      <Link to="/1234" className="w-full  h-[65%] hover:h-[85%]">
        <img
          src={Panda}
          alt="NFT Preview"
          className="w-full h-full transform-view transition-transform rounded-xl"
        />
      </Link>

      <div className="card-details text-sm w-full p-2  flex flex-col justify-between">
        <h2 className="card-title">Bored panda</h2>
        {/* <p className="card-description">NFT Description</p> */}
        <div className="card-info flex flex-col justify-between mb-2">
          <span className="card-price">Floor Price: <span className="text-blue-500">0.5 ETH</span> </span>
          <span className="card-owner">Owner: 0x123...456</span>
        </div>
        <Button text="Buy Now" />
      </div>
    </div>
  );
};

export default Card;
