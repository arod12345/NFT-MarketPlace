import Panda from "../assets/ape.jpg";
import Button from "./Button";
import { Link } from "react-router-dom";

const Card = ({ item, buyMarketItem }) => {
  return (
    <div className="flex overflow-hidden flex-col w-[18em] h-[22em] items-center mb-[10px] justify-between p-2 border-[0.1px] border-[#ffffff30]  rounded-md shadow-sm shadow-[#fef3c615]">
      <Link to="/nft/123" className="w-full  h-[65%] hover:h-[85%]">
        <img
          src={item.image}
          alt="NFT Preview"
          className="w-full h-full transform-view transition-transform rounded-lg"
        />
      </Link>

      <div className="card-details text-sm w-full p-2  flex flex-col justify-between">
        <h2 className="card-title">{item.name}</h2>
        {/* <p className="card-description">NFT Description</p> */}
        <div className="card-info flex flex-col justify-between mb-2">
          <span className="card-price">
            Floor Price:{" "}
            <span className="text-blue-500">{item.totalPrice} ETH</span>{" "}
          </span>
          <span className="card-owner">Owner: {item.owner}</span>
        </div>
        <Button text="Buy Now" event={buyMarketItem} />
      </div>
    </div>
  );
};

export default Card;
