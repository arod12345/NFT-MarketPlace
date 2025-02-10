const { ignition } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Import the module
const NFTMarketplaceModule = require("../ignition/modules/NFTDeploy.module.cjs");

async function main() {
  console.log("🚀 Deploying contracts...");
  
  // Deploy the module
  const deployed = await ignition.deploy(NFTMarketplaceModule);

  console.log(`✅ Contracts Deployed!
    📌 NFT Address: ${deployed.nft.target}
    📌 Marketplace Address: ${deployed.marketplace.target}
  `);

  // Save frontend artifacts
  saveFrontendFiles(deployed.nft, "NFT");
  saveFrontendFiles(deployed.marketplace, "Marketplace");

  console.log("✅ Frontend files updated!");
}

function saveFrontendFiles(contractInstance, name) {
  const contractsDir = path.join(__dirname, "../../src/contractsData");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save contract address
  fs.writeFileSync(
    path.join(contractsDir, `${name}-address.json`),
    JSON.stringify({ address: contractInstance.target }, null, 2)
  );

  // Save contract ABI
  const artifactPath = path.join(
    __dirname,
    `../artifacts/backend/contracts/${name}.sol/${name}.json`
  );

  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    fs.writeFileSync(
      path.join(contractsDir, `${name}.json`),
      JSON.stringify(artifact, null, 2)
    );
  } else {
    console.error(`🚨 ABI file not found: ${artifactPath}`);
  }
}

main().catch((error) => {
  console.error("🚨 Deployment Failed:", error);
  process.exit(1);
});
