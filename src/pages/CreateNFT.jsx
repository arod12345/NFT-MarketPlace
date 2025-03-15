import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import Error from "../components/Error";
import { useContext, useState } from "react";
import AppContext from "../context/Context";
import { ethers } from "ethers";
import pinata from "../utils/pinata";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {uploadToCloudinary} from "../utils/cloudniary"

const CreateNFT = () => {
  const {
    fetchGeneratedImages,
    generatedImage,
    loading,
    account,
    marketplace,
    nft,
  } = useContext(AppContext);
  const [promptData, setPromptData] = useState("");
  const [NFTData, setNFTData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const navigate = useNavigate();

  const validateInputs = () => {
    return (
      generatedImage &&
      NFTData.price &&
      NFTData.name &&
      NFTData.description &&
      account &&
      ethers.parseEther(NFTData.price) > 0
    );
  };

  const createNFT = async () => {
    if (!validateInputs()) {
      toast.error(
        "Please fill all required fields with valid values or Connect MetaMask Account"
      );
      return;
    }

    try {
      console.log("Generated Image:", generatedImage);
      
      const cloudinaryUrl = await uploadToCloudinary(generatedImage);
      toast.success("Image uploaded to Cloudinary!");

      const metadata = {
        image: cloudinaryUrl,
        name: NFTData.name,
        description: NFTData.description,
        price: NFTData.price,
        owner: account,
      };

      const file = new File(
        [JSON.stringify(metadata)],
        `${metadata.name}.json`,
        { type: "application/json" }
      );

      const upload = await pinata.upload.file(file);
      const metadataURI = `https://rose-capitalist-turtle-614.mypinata.cloud/ipfs/${upload.IpfsHash}`;

      await mintThenList(metadataURI);
      setNFTData({ name: "", description: "", price: "" });
    } catch (error) {
      console.error("NFT creation error:", error);
      toast.error(`NFT creation failed: ${error.message}`);
    }
  };

  const mintThenList = async (metadataURI) => {
    if (!nft || !marketplace) {
      throw new Error("Contracts not initialized");
    }

    const toastId = toast.loading("Starting NFT creation process...");

    try {
      // 1. Mint NFT
      toast.update(toastId, { render: "Minting NFT..." });
      const mintTx = await nft.mint(metadataURI);
      const mintReceipt = await mintTx.wait();

      // Extract token ID from mint event
      const mintEvent = mintReceipt.logs.find(
        (log) => log.fragment?.name === "Transfer"
      );
      const tokenId = mintEvent.args[2].toString();

      // 2. Approve Marketplace for specific token
      toast.update(toastId, { render: "Approving Marketplace..." });
      const approveTx = await nft.approve(marketplace.target, tokenId);
      await approveTx.wait();

      // 3. List Item
      toast.update(toastId, { render: "Listing NFT..." });
      const listingPrice = ethers.parseEther(NFTData.price.toString());
      const listTx = await marketplace.makeItem(
        nft.target,
        tokenId,
        listingPrice
      );
      await listTx.wait();

      toast.update(toastId, {
        render: "NFT Created & Listed Successfully!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      navigate(`/nft/${tokenId}`);
    } catch (error) {
      console.error("Transaction error:", {
        error,
        message: error.message,
        data: error.data,
      });
      toast.update(toastId, {
        render: `Transaction failed: ${error.reason || error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      throw error;
    }
  };

  if (!account) {
    return (
      <Error message="Please connect your wallet to view marketplace items" />
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between pb-16">
      <Navbar />
      <div className="w-full p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-[80%] p-4 md:p-8 border-[.1px] border-[#ffffff30] rounded-lg shadow-lg gap-4">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex p-2 mb-4 rounded w-full md:w-[55%] flex-col"
          >
            <input
              id="NFT Name"
              name="name"
              type="text"
              placeholder="Enter NFT Name"
              className="border-[.1px] border-[#ffffff30] mb-4 p-2 rounded w-full"
              required
              value={NFTData.name}
              onChange={(e) => setNFTData({ ...NFTData, name: e.target.value })}
            />
            <textarea
              id="description"
              name="description"
              placeholder="Enter NFT description"
              className="border-[.1px] border-[#ffffff30] mb-4 p-2 rounded w-full"
              required
              value={NFTData.description}
              onChange={(e) =>
                setNFTData({ ...NFTData, description: e.target.value })
              }
            ></textarea>
            <input
              id="Price"
              name="Price"
              type="number"
              placeholder="Enter NFT price"
              className="border-[.1px] border-[#ffffff30] mb-8 p-2 rounded w-full"
              required
              value={NFTData.price}
              onChange={(e) =>
                setNFTData({ ...NFTData, price: e.target.value })
              }
            />

            <div className="flex flex-col md:flex-row border-[.1px] border-[#ffffff30] relative rounded p-6 items-center gap-2 md:gap-4">
              <label
                htmlFor="prompt"
                className="text-white text-[12px] absolute top-[-10px] bg-[#131313] px-2"
              >
                Generate NFT Image
              </label>
              <textarea
                id="prompt"
                name="prompt"
                onChange={(e) => setPromptData(e.target.value)}
                type="text"
                value={promptData}
                placeholder="Enter a prompt to the AI and generate an image for your NFT"
                className="p-2 h-[4em] focus:border-red-300 w-full md:w-[75%]"
                required
              ></textarea>
              <button
                className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-400 w-full md:w-auto"
                disabled={loading}
                onClick={() => fetchGeneratedImages(promptData)}
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
            <button
              className="p-2 mt-4 bg-blue-500 text-white rounded cursor-pointer disabled:bg-gray-400 w-full"
              disabled={loading}
              onClick={createNFT}
            >
              Create NFT
            </button>
          </form>

          {/* Loader / Generated Image Section */}
          <div className="flex flex-col w-full md:w-[40%]">
            {loading && <Spinner text="Generating image..." />}
            {generatedImage && !loading && (
              <div className="w-full h-[20rem] flex items-center justify-center rounded bg-[#ffffff10] border-[.1px] shadow-lg shadow-[#ffffff10] border-[#ffffff20]">
                {!generatedImage ? (
                  <h1 className="text-white font-bold w-full h-full text-center">
                    Generated Image will appear here
                  </h1>
                ) : (
                  <img
                    src={generatedImage}
                    alt="Generated NFT"
                    className="w-auto h-auto max-w-full max-h-full"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
