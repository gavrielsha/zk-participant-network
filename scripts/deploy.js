const hre = require("hardhat");

async function main() {
  const DKGMultisigWallet = await hre.ethers.getContractFactory("DKGMultisigWallet");
  const dkgMultisigWallet = await DKGMultisigWallet.deploy(3); // Deploy with a threshold of 3 participants

  await dkgMultisigWallet.deployed();

  console.log("DKGMultisigWallet deployed to:", dkgMultisigWallet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
