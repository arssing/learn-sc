import { expect } from "chai";
import { ethers } from "hardhat";
import {NFT1155__factory, NFT1155} from "../typechain";

describe("NFT1155-tests", function () {

  let NFTToken: NFT1155;
  
  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    const tokenFactory = await ethers.getContractFactory("NFT1155",owner) as NFT1155__factory;
    
    NFTToken = await tokenFactory.deploy("URI/");
    await NFTToken.deployed();
  });

  it("mint", async function () {
    
    const [owner] = await ethers.getSigners();
    NFTToken.connect(owner).mint(1, 10);
    expect(await NFTToken.connect(owner).uri(1)).to.equal("URI/1.json");
  });
  
});
