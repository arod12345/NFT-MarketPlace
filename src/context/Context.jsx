import { createContext, useState, useEffect } from "react";
import axios from "axios";
// import { ethers } from "ethers";
import { toast } from "react-toastify";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useWalletClient,
  usePublicClient
} from "wagmi";
import { getContract } from "viem";

import MarketplaceAbi from "../contractsData/Marketplace.json";
import MarketplaceAddress from "../contractsData/Marketplace-address.json";
import NFTAbi from "../contractsData/NFT.json";
import NFTAddress from "../contractsData/NFT-address.json";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [generatedImage, setGeneratedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null); // Keeping account variable
  const [nft, setNFT] = useState(null);
  const [marketplace, setMarketplace] = useState(null);

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    if (isConnected && address) {
      setAccount(address); // Sync wagmi address with account state

      loadContracts(walletClient);
    } else {
      setAccount(null);
    }
  }, [isConnected, address, walletClient]);

  const loadContracts = async (walletClient) => {
    // Get deployed copies of contracts
    if (!publicClient) {
      console.error("Public client is not available");
      return;
    }
    // const chainId =  await walletClient.getChainId();
   

    // Get the right client for the connected chain
    // const client = getClient(chainId);
    const marketplace = getContract({
      address: MarketplaceAddress.address,
      abi: MarketplaceAbi.abi,
      client: walletClient,
    });
    setMarketplace(marketplace);

    const nft = getContract({
      address: NFTAddress.address,
      abi: NFTAbi.abi,
      client: walletClient,
    });
    setNFT(nft);
    setLoading(false);
  };

  const fetchGeneratedImages = async (prompt) => {
    setLoading(true);
    setGeneratedImage("");

    try {
      const response = await axios.request({
        method: "POST",
        url: import.meta.env.VITE_API_URL,
        headers: {
          "x-rapidapi-key": import.meta.env.VITE_API_KEY,
          "x-rapidapi-host": import.meta.env.VITE_HOST_DATA,
          "Content-Type": "application/json",
        },
        data: {
          text: prompt,
          width: 512,
          height: 512,
          steps: 1
        },
      });
      setGeneratedImage(response.data?.generated_image);
      toast.success("Image Generated Successfully",);
    } catch (error) {
      console.error("Error fetching image:", error);
      toast.error("Image Generation failed, try again!");
    }
    setLoading(false);
  };

  return (
    <AppContext.Provider
      value={{
        fetchGeneratedImages,
        generatedImage,
        loading,
        setLoading,
        account, // Keeping account
        address, // Wagmi connected wallet address
        isConnected,
        connect,
        connectors,
        disconnect,
        nft,
        marketplace,
        walletClient
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
