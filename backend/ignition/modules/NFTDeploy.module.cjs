const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


const NFTMarketplaceModule = buildModule("NFTMarketplaceModule", (m) => {
  // Define deployment parameters
  const feePercent = m.getParameter("feePercent", 1);

  // Deploy contracts
  const marketplace = m.contract("MarketPlace", [feePercent]);
  const nft = m.contract("NFT");

  return { marketplace, nft };
});

module.exports = NFTMarketplaceModule;