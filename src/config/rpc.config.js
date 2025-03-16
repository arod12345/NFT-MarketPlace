import { createPublicClient, http } from "viem";
import { hardhat, sepolia } from "viem/chains";

export const RPC_URLS = {
  31337: "http://127.0.0.1:8545",
  11155111: `https://eth-sepolia.g.alchemy.com/v2/${
    import.meta.env.VITE_ALCHEMEY_API_KEY
  }`
};

export const getClient = (chainId) => {
    return createPublicClient({
      chain: chainId === 31337 ? hardhat : sepolia,
      transport: http(RPC_URLS[chainId]),
    });
  };

