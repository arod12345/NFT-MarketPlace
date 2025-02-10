require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  paths: {
    artifacts: "./backend/artifacts",
    cache: "./backend/cache",
    sources: "./backend/contracts",
    tests: "./backend/test",
    ignition:"./backend/ignition"
  },
  ignition:{
    modulePath: "backend/ignition/modules",
  },
  defaultNetwork: "localhost",
};
