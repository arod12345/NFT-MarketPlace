import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import { useContext, useState, useEffect } from "react";
import AppContext from "../context/Context";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const NFTDetails = () => {
  const { itemId } = useParams();
  const { marketplace, nft, account } = useContext(AppContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mintingHash, setMintingHash] = useState(null);
  const navigate = useNavigate();

  const loadItemDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(nft);

      if (!marketplace || !nft) {
        throw new Error("Contracts not loaded");
      }

      const itemData = await marketplace.items(itemId);

      if (!itemData) {
        throw new Error("Item not found");
      }

      const uri = await nft.tokenURI(itemData.tokenId);
      const metadataResponse = await fetch(uri);
      const metadata = await metadataResponse.json();

      const owner = await nft.ownerOf(itemData.tokenId);
      const isOwner = metadata.owner.toLowerCase() === account.toLowerCase();

      const transferEvents = await nft.queryFilter(
        nft.filters.Transfer(null, owner)
      );
      if (transferEvents.length > 0) {
        setMintingHash(transferEvents[0].transactionHash);
        console.log("Minting Hash:", transferEvents[0].transactionHash);
      }

      setItem({
        ...itemData,
        metadata,
        owner,
        isOwner,
        totalPrice: await marketplace.getTotalPrice(itemId),
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading item details:", error);
      setError(error.message);
    }
  };

  const buyItem = async () => {
    if (!item || !marketplace) return;

    const buyToast = toast.loading(`Purcahsing ${item.name} NFT  ..`);

    try {
      const tx = await marketplace.purchaseItem(item.itemId, {
        value: item.totalPrice,
      });
      await tx.wait();
      toast.update(buyToast, {
        render: `Purchased  ${item.name} NFT Successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      navigate("/purchased");
    } catch (error) {
      console.error("Error buying item:", error);
      toast.update(buyToast, {
        render: ` Erorr Purchasing ${item.name} NFT`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    if (itemId) {
      loadItemDetails();
    }
  }, [itemId, marketplace, nft]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-400 mb-4">
            <Link to="/" className="hover:text-blue-400">
              Home
            </Link>
            {" > "}
            <span className="text-white">{item.metadata.name}</span>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="bg-[#ffffff10] p-4 rounded-lg">
              <img
                src={item.metadata.image}
                alt={item.metadata.name}
                className="w-full h-auto max-h-[600px] object-contain rounded"
              />
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{item.metadata.name}</h1>
              <p className="text-gray-400">{item.metadata.description}</p>

              <div className="flex flex-col bg-[#ffffff10] p-4 rounded-lg  items-center justify-center">
                {/* Price Section */}
                <div className="w-full my-4 flex justify-between items-center">
                  <span className="text-gray-400">Price</span>
                  <span className="text-2xl font-bold">
                    {ethers.formatEther(item.totalPrice)} ETH
                  </span>
                </div>

                {/* Owner Section */}
                <div className="w-full mb-4 flex justify-between items-center">
                  <span className="text-gray-400">Owned by</span>
                  <a
                    href={`https://sepolia.etherscan.io/${item.metadata.owner}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {item.owner === account
                      ? "You"
                      : `${item.owner.slice(
                          0,
                          6
                        )}...${item.metadata.owner.slice(-4)}`}
                  </a>
                </div>

                {/* Minting Hash */}
                <div className="w-full mb-4 flex justify-between items-center">
                  <span className="text-gray-400">Minting Hash</span>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${mintingHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {mintingHash.slice(0, 6)}...{mintingHash.slice(-4)}
                  </a>
                </div>

                {/* NFt Address */}
                <div className="w-full mb-4 flex justify-between items-center">
                  <span className="text-gray-400">NFT Address</span>
                  <a
                    href={`https://sepolia.etherscan.io/address/${nft.target}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {item.owner.slice(0, 6)}...{nft.target.slice(-4)}
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              {!item.sold && (
                <div className="space-y-4">
                  {item.isOwner ? (
                    <button
                      disabled
                      className="w-full p-3 bg-gray-600 text-white rounded cursor-not-allowed"
                    >
                      Your Item
                    </button>
                  ) : (
                    <button
                      onClick={buyItem}
                      className="w-full bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold p-4 rounded"
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              )}

              {item.sold && (
                <div className="text-center py-4 text-gray-400">
                  This item has been sold
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NFTDetails;
