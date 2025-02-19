import { Link } from "react-router-dom";
import { ethers } from "ethers";

const Card = ({
  item,
  buyMarketItem,
  home,
  isListed,
  isPurchased,
  isOwner,
}) => {
  const owner = item.seller;

  return (
    <div
      className={`flex overflow-hidden flex-col w-[18em] h-[22em] items-center mb-[10px] justify-between p-2 border-[0.1px] border-[#ffffff30]
        rounded-md shadow-sm shadow-[#fef3c615]`}
    >
      <Link
        to={`/nft/${item.itemId}`}
        className="w-full  h-[65%] hover:h-[95%]"
      >
        <img
          src={item.image}
          alt="NFT Preview"
          className="w-full aspect-square object-cover transform-view transition-transform rounded-lg"
        />
      </Link>

      <div className="card-details bg-[#131313] text-sm w-full   flex flex-col justify-between">
        <h2 className="card-title text-lg font-extrabold ml-2 truncate">
          {item.name}
        </h2>
        {/* <p className="card-description">NFT Description</p> */}
        <div className="card-info flex flex-col  px-2 justify-between mb-2">
          <span className="card-price">
            Floor Price:{" "}
            <span className="text-green-500 font-bold">
              {ethers.formatEther(item.totalPrice)} ETH
            </span>
          </span>
          <span className="card-owner">
            Owner: {owner.slice(0, 5) + "..." + owner.slice(38, 42)}
          </span>
        </div>

        {!item.sold && home && (
          <div className="">
            {isOwner ? (
              <button
                disabled
                className="bg-gray-500 w-full hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-not-allowed"
              >
                Your Item
              </button>
            ) : (
              <button
                onClick={() => buyMarketItem(item)}
                className="bg-blue-500 w-full hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded"
              >
                Buy Now
              </button>
            )}
          </div>
        )}

        {isPurchased && (
          <div className="cursor-pointer w-full border-[.1px] border-green-400 text-center text-green-400 font-bold py-2 px-4 rounded">
            Purchased
          </div>
        )}

        {isListed && (
          <button className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded">
            Listed
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
