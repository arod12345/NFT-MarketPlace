require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  paths: {
    artifacts: "./backend/artifacts",
    cache: "./backend/cache",
    sources: "./backend/contracts",
    tests: "./backend/test",
    ignition: "./backend/ignition",
  },
  ignition: {
    modulePath: "backend/ignition/modules",
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMEY_API_KEY}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  defaultNetwork: "localhost",
};
