import hre from "hardhat";
const { ethers } = hre;

async function main() {
  const [deployer, deployer2] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log(
    "Account balance:",
    ethers.formatEther(await deployer.provider.getBalance(deployer.address))
  );

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();

  const MarketPlace = await ethers.getContractFactory("MarketPlace");
  const marketPlace = await MarketPlace.deploy(1);

  // await nft.deployed();

  console.log("NFT Address:", nft.target);
  console.log("Marketplace Address:", marketPlace.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
