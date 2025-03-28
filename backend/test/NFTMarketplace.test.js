import chai from "chai";
import hre from "hardhat";
const { ethers } = hre;

const { expect } = chai;

const toWei = (num) => ethers.parseEther(num.toString());
const fromWei = (num) => ethers.formatEther(num);

describe("NFTMarketplace", function () {
  let NFT;
  let nft;
  let Marketplace;
  let marketplace;
  let deployer;
  let addr1;
  let addr2;
  let addrs;
  let feePercent = 1;
  let URI = "sample URI";

  beforeEach(async function () {
    // Get the ContractFactories and Signers here.
    NFT = await ethers.getContractFactory("NFT");
    Marketplace = await ethers.getContractFactory("MarketPlace");
    [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contracts
    nft = await NFT.deploy();
    await nft.waitForDeployment();
    marketplace = await Marketplace.deploy(feePercent);
    await marketplace.waitForDeployment();
    console.log("NFT deployed at:", nft.target);
    console.log("Marketplace deployed at:", marketplace.target);
  });

  describe("Deployment", function () {
    it("Should track name and symbol of the nft collection", async function () {
      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      const nftName = "MY NFT";
      const nftSymbol = "MYF";
      expect(await nft.name()).to.equal(nftName);
      expect(await nft.symbol()).to.equal(nftSymbol);
    });

    it("Should track feeAccount and feePercent of the marketplace", async function () {
      expect(await marketplace.feeAccount()).to.equal(deployer.address);
      expect(await marketplace.feePercent()).to.equal(feePercent);
    });
  });

  describe("Minting NFTs", function () {
    it("Should track each minted NFT", async function () {
      // addr1 mints an nft
      await nft.connect(addr1).mint(URI);
      expect(await nft.tokenCount()).to.equal(1);
      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.tokenURI(1)).to.equal(URI);
      // addr2 mints an nft
      await nft.connect(addr2).mint(URI);
      expect(await nft.tokenCount()).to.equal(2);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
      expect(await nft.tokenURI(2)).to.equal(URI);
    });
  });

  describe("Making marketplace items", function () {
    let price = 1;
    let result;
    beforeEach(async function () {
      // addr1 mints an nft
      await nft.connect(addr1).mint(URI);
      // addr1 approves marketplace to spend nft
      await nft.connect(addr1).setApprovalForAll(marketplace.target, true);
    });

    it("Should track newly created item, transfer NFT from seller to marketplace and emit Offered event", async function () {
      // addr1 offers their nft at a price of 1 ether
      await expect(
        marketplace.connect(addr1).makeItem(nft.target, 1, toWei(price))
      )
        .to.emit(marketplace, "Offered")
        .withArgs(1, nft.target, 1, toWei(price), addr1.address);
      // Owner of NFT should now be the marketplace
      expect(await nft.ownerOf(1)).to.equal(marketplace.target);
      // Item count should now equal 1
      expect(await marketplace.itemCount()).to.equal(1);
      // Get item from items mapping then check fields to ensure they are correct
      const item = await marketplace.items(1);
      expect(item.itemId).to.equal(1);
      expect(item.nft).to.equal(nft.target);
      expect(item.tokenId).to.equal(1);
      expect(item.price).to.equal(toWei(price));
      expect(item.sold).to.equal(false);
    });

    it("Should fail if price is set to zero", async function () {
      await expect(
        marketplace.connect(addr1).makeItem(nft.target, 1, 0)
      ).to.be.revertedWith("Price must be greater than zero");
    });
  });
  describe("Purchasing marketplace items", function () {
    let price = 2;
    let fee = (feePercent / 100) * price;
    let totalPriceInWei;
    beforeEach(async function () {
      // addr1 mints an nft
      await nft.connect(addr1).mint(URI);
      // addr1 approves marketplace to spend tokens
      await nft.connect(addr1).setApprovalForAll(marketplace.target, true);
      // addr1 makes their nft a marketplace item.
      await marketplace.connect(addr1).makeItem(nft.target, 1, toWei(price));
    });
    it("Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event", async function () {
      const sellerInitalEthBal = await ethers.provider.getBalance(
        addr1.address
      );
      const feeAccountInitialEthBal = await ethers.provider.getBalance(
        deployer.address
      );
      // fetch items total price (market fees + item price)
      totalPriceInWei = await marketplace.getTotalPrice(1);
      // addr 2 purchases item.
      await expect(
        marketplace.connect(addr2).purchaseItem(1, { value: totalPriceInWei })
      )
        .to.emit(marketplace, "Bought")
        .withArgs(1, nft.target, 1, toWei(price), addr1.address, addr2.address);
      const sellerFinalEthBal = await ethers.provider.getBalance(addr1.address);
      const feeAccountFinalEthBal = await ethers.provider.getBalance(
        deployer.address
      );
      // Item should be marked as sold
      expect((await marketplace.items(1)).sold).to.equal(true);
      // Seller should receive payment for the price of the NFT sold.
      expect(sellerFinalEthBal).to.equal(sellerInitalEthBal + toWei(price));
      expect(feeAccountFinalEthBal).to.equal(
        feeAccountInitialEthBal + toWei(fee)
      );

      // feeAccount should receive fee
      // expect(+fromWei(feeAccountFinalEthBal)).to.equal(
      //   +fee + +fromWei(feeAccountInitialEthBal)
      // );
      // The buyer should now own the nft
      expect(await nft.ownerOf(1)).to.equal(addr2.address);
    });
    it("Should fail for invalid item ids, sold items and when not enough ether is paid", async function () {
      // fails for invalid item ids
      await expect(
        marketplace.connect(addr2).purchaseItem(2, { value: totalPriceInWei })
      ).to.be.revertedWith("item doesn't exist");
      await expect(
        marketplace.connect(addr2).purchaseItem(0, { value: totalPriceInWei })
      ).to.be.revertedWith("item doesn't exist");
      // Fails when not enough ether is paid with the transaction.
      // In this instance, fails when buyer only sends enough ether to cover the price of the nft
      // not the additional market fee.
      await expect(
        marketplace.connect(addr2).purchaseItem(1, { value: toWei(price) })
      ).to.be.revertedWith(
        "not enough ether to cover item price and market fee"
      );
      // addr2 purchases item 1
      await marketplace
        .connect(addr2)
        .purchaseItem(1, { value: totalPriceInWei });
      // addr3 tries purchasing item 1 after its been sold
      const addr3 = addrs[0];
      await expect(
        marketplace.connect(addr3).purchaseItem(1, { value: totalPriceInWei })
      ).to.be.revertedWith("item already sold");
    });
  });
});
