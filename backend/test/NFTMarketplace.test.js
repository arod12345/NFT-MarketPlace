import chai from "chai";
import hre from "hardhat";
const { ethers } = hre;

const { expect } = chai;

const toWei = (num) => ethers.parseEther(num.toString());
const fromWei = (num) => ethers.formatEther(num);

describe("NFT MarketPlace", function () {
  let nft, marketPlace, deployer, add1, add2;
  let feePercent = 1;
  const URI = "Sample URI";

  beforeEach(async () => {
    [deployer, add1, add2] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();

    const MarketPlace = await ethers.getContractFactory("MarketPlace");
    marketPlace = await MarketPlace.deploy(feePercent);
  });

  it("Should be able to fetch the NFT's Name and Symbol", async () => {
    expect(await nft.name()).to.equal("MY NFT");
    expect(await nft.symbol()).to.equal("MYF");
  });

  it("Should be able to fetch the NFT's Fee Percent and Fee Collecting Account", async () => {
    expect(await marketPlace.feeAccount()).to.equal(deployer.address);
    expect(await marketPlace.feePercent()).to.equal(1);
  });

  describe("Minting NFT's", () => {
    it("Should be able to track each minted NFts's", async () => {
      await nft.connect(add1).mint(URI);

      expect(await nft.tokenCount()).to.be.equal(1);
      //  expect(await nft.balanceOf(add1)).to.be.equal(1);
      //  expect(await nft.tokenURI()).to.be.equal(URI);
    });
  });
  describe("Making marketplace items ", () => {
    beforeEach(async () => {
      await nft.connect(add1).mint(URI);
      await nft.connect(add1).setApprovalForAll(marketPlace.address, true);
    });
  
    it("should track newly created items,Transfer Nft from seller to MarketPlace and emit the offered event", async () => {
      expect(await marketPlace.connect(addl).makeItem(nft.address, 1, toWei("1")))
        .to.emit(marketPlace, "Offered")
        .withArgs(1, toWei("1"), add1.address, nft.address, 1);
    });
  });
});

