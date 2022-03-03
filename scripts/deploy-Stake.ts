import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("StakingERC20");
  let contract = await factory.deploy("0x1a8a589af81cb69cbf932fe6267d9a9f4fffbc66","0xd86c499d3c284e80558f343aa1b87e0e18c77d66");

  await contract.deployed();
  console.log(`Contract address: ${contract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });