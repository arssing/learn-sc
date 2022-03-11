import { expect } from "chai";
import { ethers } from "hardhat";
import {NFT721__factory, NFT721} from "../typechain";

describe("NFT721-tests", function () {

  let NFTToken: NFT721;
  
  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    const tokenFactory = await ethers.getContractFactory("NFT721",owner) as NFT721__factory;
    
    NFTToken = await tokenFactory.deploy("FirstNFT","FNFT");
    await NFTToken.deployed();
  });

  it("mint", async function () {
    
    const [owner] = await ethers.getSigners();
    NFTToken.connect(owner).mint(owner.address, "URI");
    const testURI = await NFTToken.connect(owner).tokenURI(1);
    expect(testURI).to.equal("URI");
  });

  it("name and symbol", async function () {
    const [owner] = await ethers.getSigners();
    const name = await NFTToken.connect(owner).name();
    const symbol = await NFTToken.connect(owner).symbol();
    expect(name).to.equal("FirstNFT");
    expect(symbol).to.equal("FNFT");
  });

  it("mint and tokenURI require", async function () {
    var num = 10;

    const [owner] = await ethers.getSigners();
    await expect(
        NFTToken.connect(owner).tokenURI(1)
        ).to.be.revertedWith("NFT721::tokenURI:nonexistent token");
    
    while (num > 0) { 
        await NFTToken.connect(owner).mint(owner.address, "URI");
        num--; 
    }
    await expect(
        NFTToken.connect(owner).mint(owner.address, "URI")
        ).to.be.revertedWith("NFT721::mint:max NFT limit");
  });

  it("balanceOf and ownerOf", async function () {
    const [owner] = await ethers.getSigners();
    await NFTToken.connect(owner).mint(owner.address, "URI");
    const balanceOfOwner = await NFTToken.connect(owner).balanceOf(owner.address);
    const ownerOfFirst = await NFTToken.connect(owner).ownerOf(1);
    expect(balanceOfOwner).to.equal(1);
    expect(ownerOfFirst).to.equal(owner.address);
  });

  it("approve, safeTransferFrom, TransferFrom, getApproved", async function () {
    const [owner, addr1] = await ethers.getSigners();
    await NFTToken.connect(owner).mint(owner.address, "URI");

    await expect(
      NFTToken.connect(addr1)["safeTransferFrom(address,address,uint256)"](owner.address, addr1.address, 1)
    ).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
    
    await expect(
      NFTToken.connect(owner).approve(owner.address, 1)
    ).to.be.revertedWith("ERC721: approval to current owner");

    await expect(
      NFTToken.connect(addr1).approve(addr1.address, 1)
    ).to.be.revertedWith("ERC721: approve caller is not owner nor approved for all");

    await NFTToken.connect(owner).approve(addr1.address, 1);
    expect(await NFTToken.connect(owner).getApproved(1)).to.equal(addr1.address);

    await NFTToken.connect(addr1).transferFrom(owner.address, addr1.address, 1);
    expect(await NFTToken.connect(owner).ownerOf(1)).to.equal(addr1.address);

    await NFTToken.connect(addr1)["safeTransferFrom(address,address,uint256)"](addr1.address, owner.address, 1);
    expect(await NFTToken.connect(owner).ownerOf(1)).to.equal(owner.address);
  });

  it("setApprovalForAll, isApprovedForAll", async function () {
    const [owner, addr1] = await ethers.getSigners();
    await NFTToken.connect(owner).mint(owner.address, "URI");
    await NFTToken.connect(owner).mint(owner.address, "URI2");
    
    await expect(
      NFTToken.connect(owner).setApprovalForAll(owner.address, true)
    ).to.be.revertedWith("ERC721: approve to caller");

    await NFTToken.connect(owner).setApprovalForAll(addr1.address, true);
    
    expect(await NFTToken.connect(owner).isApprovedForAll(owner.address, addr1.address)).to.equal(true);
    
    await NFTToken.connect(addr1).transferFrom(owner.address, addr1.address, 1);
    await NFTToken.connect(addr1).transferFrom(owner.address, addr1.address, 2);

    expect(await NFTToken.connect(addr1).ownerOf(1)).to.equal(addr1.address);
    expect(await NFTToken.connect(addr1).ownerOf(2)).to.equal(addr1.address);
  });

  it("tokenByIndex, tokenOfOwnerByIndex, totalSupply", async function () {
    const [owner, addr1] = await ethers.getSigners();
    await NFTToken.connect(owner).mint(owner.address, "URI");
    await NFTToken.connect(owner).mint(addr1.address, "URI2");
    await NFTToken.connect(owner).mint(owner.address, "URI2");
    
    const byOwnerIndex = await NFTToken.connect(owner).tokenOfOwnerByIndex(owner.address, 1);
    expect(byOwnerIndex).to.equal(3);

    const tokByInd = await NFTToken.connect(owner).tokenByIndex(2);
    expect(tokByInd).to.equal(3);

    const totSup = await NFTToken.connect(owner).totalSupply();
    expect(totSup).to.equal(3);
  });

  

});
