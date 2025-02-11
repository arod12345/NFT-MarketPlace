import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { useContext, useState, useEffect } from "react";
import AppContext from "../context/Context";
import { ethers } from "ethers";
import pinata from "../utils/pinata";
import { toast } from "react-toastify";

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

  const createNFT = async () => {
    console.log("createNFT called", { generatedImage, NFTData, account });

    if (
      !generatedImage ||
      !NFTData.price ||
      !NFTData.name ||
      !NFTData.description ||
      !account
    )
      return;

    try {
      const metadata = {
        image: generatedImage,
        price: NFTData.price,
        name: NFTData.name,
        description: NFTData.description,
        owner: account,
      };

      // const blob = new Blob([JSON.stringify(metadata)], {
      //   type: "application/json",
      // });
      const file = new File(
        [JSON.stringify(metadata)],
        `${metadata.name}.json`,
        {
          type: "application/json",
        }
      );

      const upload = await pinata.upload.file(file);
      console.log(upload);

      const result = upload.IpfsHash;
      mintThenList(result);

      setNFTData({ name: "", description: "", price: "" });
    } catch (error) {
      console.error("Pinata metadata upload error:", error);
    }
  };

  const mintThenList = async (result) => {
    if (!nft) {
      console.error("NFT contract not initialized");
      return;
    }
    console.log("NFT Contract in mintThenList:", nft); // Log the nft object
    const uri = `https://rose-capitalist-turtle-614.mypinata.cloud/ipfs/${result.toString()}`;
    const toastId = toast.loading("Minting NFT...");

    try {
      // 1. Verify contract instances
      console.log("NFT Contract Address:", nft.target);
      console.log("Marketplace Address:", marketplace.target);

      // 2. Get initial token count
      const initialTokenCount = await nft.tokenCount();
      // console.log("Initial Token Count:", initialTokenCount.toString());

      // 3. Mint with detailed logging
      console.log("Minting with URI:", uri);
      const mintTx = await nft.mint(uri, { gasLimit: 300000 });
      toast.update(toastId, {
        render: `Mint transaction sent:${mintTx.hash}`,
        type: "info",
        isLoading: false,
        autoClose: 1000,
      });
      // console.log("Mint transaction sent:", mintTx.hash);

      // const mintReceipt = await mintTx.wait();
      // console.log("Mint successful. Block:", mintReceipt.blockNumber);

      // 4. Get new token ID
      const newTokenCount = initialTokenCount + 1n;
      const id = newTokenCount; // Assuming tokenCount increments after mint
      // console.log("New Token ID:", id.toString());

      // 5. Verify ownership
      // const owner = await nft.ownerOf(id);
      // // console.log("NFT Owner:", owner);
      // // console.log("Current Account:", account);

      // 6. Approve marketplace
      const approveTx = await nft.approve(marketplace.target, id, {
        gasLimit: 300000,
      });

      console.log("Approve transaction:", approveTx.hash);
      await approveTx.wait();

      // 7. Prepare listing price
      const listingPrice = ethers.parseEther(NFTData.price.toString());
      console.log("Listing Price (ETH):", NFTData.price);
      console.log("Listing Price (wei):", listingPrice.toString());

      const toastId1 = toast.loading("Listing NFT:...");
      // 8. List item with explicit parameters
      const listTx = await marketplace.makeItem(nft.target, id, listingPrice, {
        gasLimit: 300000,
      });
      console.log("List transaction:", listTx.hash);
      await listTx.wait();

      toast.update(toastId1, {
        render: `NFT successfully listed:${listTx.hash}`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      console.log("NFT successfully listed!");
    } catch (error) {
      console.error("Full error details:", {
        error,
        message: error.message,
        code: error.code,
        reason: error.reason,
        data: error.data,
      });
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
              className="border-[.1px] border-[#ffffff30] mb-8 p-2 rounded"
              required
              value={NFTData.price}
              onChange={(e) =>
                setNFTData({ ...NFTData, price: e.target.value })
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
