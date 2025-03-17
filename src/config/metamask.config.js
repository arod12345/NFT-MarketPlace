import { http, createConfig } from "wagmi";
import { sepolia, hardhat } from "viem/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  ssr: false, // Make sure to enable this for server-side rendering (SSR) applications.
  chains: [sepolia, hardhat],
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(
      `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.ALCHEMEY_API_KEY}`
    ),
    [hardhat.id]: http("http://127.0.0.1:8545/"),
  },
});
