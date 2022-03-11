import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("NFT1155");
  let contract = await factory.deploy("ipfs://bafybeifhwwvuossb2h5pr3d7s2ncpazpiay7ryer7cs52cxbg6kg7ofpru/");

  await contract.deployed();
  console.log(`Contract address: ${contract.address}`);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });