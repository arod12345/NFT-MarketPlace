import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { useContext, useState, useEffect } from "react";
import AppContext from "../context/Context";
import { ethers } from "ethers";
import { createHelia } from "helia";
import { json } from "@helia/json";

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
    image: "",
    price: "",
    quantity: "",
    owner: "",
    address: "",
  });
  const [helia, setHelia] = useState(null);

  // Initialize Helia on component mount.
  useEffect(() => {
    async function initHelia() {
      try {
        const node = await createHelia();
        setHelia(node);
      } catch (error) {
        console.error("Failed to initialize Helia:", error);
      }
    }
    initHelia();
  }, []);

  // Create NFT: upload JSON metadata (using the generated image) then mint and list the NFT.
  const createNFT = async () => {
    if (
      !generatedImage ||
      !NFTData.price ||
      !NFTData.name ||
      !NFTData.description ||
      !helia
    )
      return;
    try {
      const j = json(helia);
      const metadata = {
        image: generatedImage,
        price: NFTData.price,
        name: NFTData.name,
        description: NFTData.description,
        owner: account,
      };
      const result = await j.add(metadata);
      mintThenList(result);
    } catch (error) {
      console.error("Helia metadata upload error:", error);
    }
  };

  const mintThenList = async (result) => {
    if (!nft) {
      console.error("NFT contract not initialized");
      return;
    }
    console.log("NFT Contract in mintThenList:", nft); // Log the nft object
    const uri = `https://ipfs.io/ipfs/${result.toString()}`;
    try {
      console.log("Minting NFT with URI:", uri);
      const tx = await nft.mint(uri);
      await tx.wait();
      console.log("NFT minted successfully");

      const id = await nft.tokenCount();
      console.log("Token ID:", id.toString());

      console.log("Approving marketplace...");
      await (await nft.setApprovalForAll(marketplace.address, true)).wait();
      console.log("Marketplace approved");

      const listingPrice = ethers.utils.parseEther(NFTData.price.toString());
      console.log("Listing NFT on marketplace...");
      await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
      console.log("NFT listed successfully");
    } catch (error) {
      console.error("Error in minting or listing NFT:", error);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-between flex-col pb-16">
      <Navbar />
      <div className="w-full p-8 h-full flex flex-col items-center justify-center">
        <div className="flex items-center justify-between w-[80%] h-full p-8 border-[.1px] border-[#ffffff30] rounded-lg shadow-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex p-2 mb-4 rounded w-[55%] flex-col"
          >
            <input
              id="NFT Name"
              name="name"
              type="text"
              placeholder="Enter NFT Name"
              className="border-[.1px] border-[#ffffff30] mb-4 p-2 rounded"
              required
              value={NFTData.name}
              onChange={(e) => setNFTData({ ...NFTData, name: e.target.value })}
            />
            <textarea
              id="description"
              name="description"
              type="text"
              placeholder="Enter NFT description"
              className="border-[.1px] border-[#ffffff30] mb-4 p-2 rounded"
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
              className="border-[.1px] border-[#ffffff30] mb-4 p-2 rounded"
              required
              value={NFTData.price}
              onChange={(e) =>
                setNFTData({ ...NFTData, price: e.target.value })
              }
            />
            <input
              id="quantity"
              name="quantity"
              type="number"
              placeholder="Enter NFT quantity"
              className="border-[.1px] border-[#ffffff30] mb-4 p-2 rounded"
              required
              value={NFTData.quantity}
              onChange={(e) =>
                setNFTData({ ...NFTData, quantity: e.target.value })
              }
            />
            <div className="flex border-[.1px] border-[#ffffff30] relative rounded p-6 items-center justify-between">
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
                placeholder="Enter a prompt to generate an image for your NFT"
                className="p-2 h-[4em] focus:border-red-300 w-[75%]"
                required
              ></textarea>
              <button
                className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                disabled={loading}
                onClick={() => fetchGeneratedImages(promptData)}
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
            <button
              className="p-2 mt-4 bg-blue-500 text-white rounded cursor-pointer disabled:bg-gray-400"
              disabled={loading}
              onClick={createNFT}
            >
              Create NFT
            </button>
          </form>
          {/* Loader / Generated Image Section */}
          <div className="flex flex-col">
            {loading && <Spinner text="Generating image..." />}
            {generatedImage && !loading && (
              <div className="w-[24rem] h-[24rem] flex items-center justify-center rounded bg-[#ffffff10] border-[.1px] shadow-lg shadow-[#ffffff10] border-[#ffffff20]">
                <img
                  src={generatedImage}
                  alt="Generated NFT"
                  className="w-auto h-auto max-w-full max-h-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
