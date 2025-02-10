import { createContext, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

import MarketplaceAbi from "../contractsData/Marketplace.json";
import MarketplaceAddress from "../contractsData/Marketplace-address.json";
import NFTAbi from "../contractsData/NFT.json";
import NFTAddress from "../contractsData/NFT-address.json";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [generatedImage, setGeneratedImage] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);

    const provider = new ethers.BrowserProvider(window.ethereum);

    const signer =await provider.getSigner();

    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async function (accounts) {
      setAccount(accounts[0]);
      await web3Handler();
    });
    loadContracts(signer);
  };

  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract(
      MarketplaceAddress.address,
      MarketplaceAbi.abi,
      signer
    );
    setMarketplace(marketplace);
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    setNFT(nft);
    setLoading(false);
  };

  const fetchGeneratedImages = async (prompt) => {
    setLoading(true); // Start loading
    setGeneratedImage(""); // Clear previous image
    try {
      const response = await axios.request({
        method: "POST",
        url: import.meta.env.VITE_API_URL,
        headers: {
          "x-rapidapi-key": import.meta.env.VITE_API_KEY,
          "x-rapidapi-host": import.meta.env.VITE_HOST_DATA,
          "Content-Type": "application/json",
        },
        data: { prompt, image_size: "portrait_16_9" },
      });

      setGeneratedImage(response.data?.url);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
    setLoading(false); // Stop loading
  };

  return (
    <AppContext.Provider
      value={{
        fetchGeneratedImages,
        generatedImage,
        loading,
        setLoading,
        account,
        nft,
        marketplace,
        web3Handler,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
