import { createContext, useState, useEffect } from "react";
import axios from "axios";
// import { ethers } from "ethers";
import { toast } from "react-toastify";
import {
  useAccount,
  useConnect,
  useDisconnect,
  // useWalletClient,
  usePublicClient,
} from "wagmi";
import { getContract } from "viem";
import  {} from "@wagmi/core"
// import { getWalletClient } from "@wagmi/core";
// import { getAccount,  } from "@wagmi/core";

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
  // const [signer, setSigner] = useState(null);

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  // const chainId = useChainId();
  const publicClient = usePublicClient();
  // const { data: walletClient } = useWalletClient();

  useEffect(() => {
    console.log(
      "Effect triggered - isConnected:",
      isConnected,
      "address:",
      address
    );
    if (isConnected && address) {
      setAccount(address); // Sync wagmi address with account state

      loadContracts();
    } else {
      setAccount(null);
    }
  }, [isConnected, address]);

  // useEffect(() => {
  //   if (walletClient) {
  //     setSigner(walletClient);
  //     console.log("Signer set:", walletClient);
  //   } else {
  //     console.warn("Wallet client is still null");
  //   }
  // }, [walletClient]);

  const loadContracts = async () => {
    // Get deployed copies of contracts
    if (!publicClient) {
      console.error("Public client is not available");
      return;
    }
    console.log("isConnected:", isConnected);
    console.log("Wallet Address:", address);

    const marketplace = getContract({
      address: MarketplaceAddress.address,
      abi: MarketplaceAbi.abi,
      client: publicClient,
    });
    setMarketplace(marketplace);

    const nft = getContract({
      address: NFTAddress.address,
      abi: NFTAbi.abi,
      client: publicClient,
    });
    setNFT(nft);
    console.log("Marketplace:", marketplace);
    console.log("NFT:", nft);
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
          prompt: prompt,
          style_id: 2,
          size: "1-1",
        },
      });
      setGeneratedImage(response.data?.final_result[0].origin);
      toast.success("Image Generated Successfully");
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
