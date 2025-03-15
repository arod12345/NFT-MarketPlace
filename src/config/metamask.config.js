import { http, createConfig } from "wagmi";
import { sepolia, localhost } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  ssr: false, // Make sure to enable this for server-side rendering (SSR) applications.
  chains: [sepolia, localhost],
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(
      `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.ALCHEMEY_API_KEY}`
    ),
    // [lineaSepolia.id]: http(),
    [localhost.id]: http("http://127.0.0.1:8545/"),
  },
});
