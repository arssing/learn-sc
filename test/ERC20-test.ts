import { expect } from "chai";
import { ethers } from "hardhat";
import {ERC20__factory, ERC20} from "../typechain";

describe("ERC20-Token-tests", function () {

  let tokenContract: ERC20;
  let initName: string = "TestERC20";
  let initSymbol: string = "TERC";

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    const tokenFactory = await ethers.getContractFactory("ERC20",owner) as ERC20__factory;
    tokenContract = await tokenFactory.deploy(initName,initSymbol);
    await tokenContract.deployed();
  });

  it("Test name, symbol, decimals", async function () {

    const [owner, user] = await ethers.getSigners();
    
    expect(await tokenContract.name()).to.equal(initName);
    expect(await tokenContract.symbol()).to.equal(initSymbol);
    expect(await tokenContract.decimals()).to.equal(18);
  });

  it("Test mint", async function () {
   
    const [owner, user1, user2] = await ethers.getSigners();
    const toMint = ethers.utils.parseEther("0.1");
    await tokenContract.connect(owner).mint(owner.address, toMint);
    const tx = await tokenContract.connect(owner).balanceOf(owner.address);
    expect(tx).to.equal(toMint);

    //not minter try mint
    await expect(
      tokenContract.connect(user2).mint(user1.address, toMint)
    ).to.be.revertedWith("you are not an owner");
  });

  it("Test totalSupply and burn", async function () {
    const [owner, user1] = await ethers.getSigners();
    const toMint = ethers.utils.parseEther("0.001");
    const toBurn = ethers.utils.parseEther("0.0001");
    const endBalance = ethers.utils.parseEther("0.0009");

    await tokenContract.connect(owner).mint(owner.address, toMint);
    await tokenContract.connect(owner).burn(toBurn);

    const endSup = await tokenContract.connect(owner).totalSupply();
    const balanceAfter = await tokenContract.connect(owner).balanceOf(owner.address);
    expect(balanceAfter).to.equal(endBalance);
    expect(endSup).to.equal(endBalance);

    await expect(
      tokenContract.connect(owner).burn(toMint)
    ).to.be.revertedWith("burn amount exceeds balance");
    await expect(
      tokenContract.connect(user1).burn(toMint)
    ).to.be.revertedWith("you are not an owner");
  });

  it("Test transfer", async function () {
   
    const [owner, user1, user2] = await ethers.getSigners();
    const toMint = ethers.utils.parseEther("0.1");
    const transferAmount = ethers.utils.parseEther("0.05");

    await tokenContract.connect(owner).mint(user1.address, toMint);
  
    await tokenContract.connect(user1).transfer(user2.address, transferAmount);
    const balanceAfter = await tokenContract.connect(user1).balanceOf(user1.address);
    
    expect(balanceAfter).to.equal(transferAmount);

    await expect(
      tokenContract.connect(user1).transfer(user2.address, toMint)
    ).to.be.revertedWith("transfer: transfer amount exceeds balance");
  });

  it("Test approve and allowance", async function () {
 
    const [owner, user1] = await ethers.getSigners();
    const approveValue = ethers.utils.parseEther("0.1");

    await tokenContract.connect(owner).approve(user1.address, approveValue);
    const tx = await tokenContract.connect(owner).allowance(owner.address, user1.address);
    
    expect(tx).to.equal(approveValue);
  });

  it("Test transferFrom", async function () {

    const [owner, user1, user2] = await ethers.getSigners();
    const toMint = ethers.utils.parseEther("0.2");
    const approveValue = ethers.utils.parseEther("0.1");
    const toTransfer = ethers.utils.parseEther("0.06");

    await tokenContract.connect(owner).mint(owner.address, toMint);

    await tokenContract.connect(owner).approve(user1.address, approveValue);
    await tokenContract.connect(user1).transferFrom(owner.address, user2.address, toTransfer);

    const user2Balance = await tokenContract.connect(user2).balanceOf(user2.address);
    expect(user2Balance).to.equal(toTransfer);
    
    await expect(
      tokenContract.connect(user1).transferFrom(owner.address, user2.address, toMint)
    ).to.be.revertedWith("transferFrom: transfer amount exceeds balance");

    await expect(
      tokenContract.connect(user1).transferFrom(owner.address, user2.address, toTransfer)
    ).to.be.revertedWith("transferFrom: transfer amount exceeds allowed amount");
    
  });

  it("Test increaseAllowance", async function () {

    const [owner, user1] = await ethers.getSigners();
    const startAmount = ethers.utils.parseEther("0.2");
    const addAmount = ethers.utils.parseEther("0.1");
    const endAmount = ethers.utils.parseEther("0.3");
    const nullAddress = "0x0000000000000000000000000000000000000000";

    await tokenContract.connect(owner).approve(user1.address, startAmount);
    await tokenContract.connect(owner).increaseAllowance(user1.address, addAmount);

    const tx = await tokenContract.connect(owner).allowance(owner.address, user1.address);
    expect(tx).to.equal(endAmount);

    await expect(
      tokenContract.connect(user1).increaseAllowance(nullAddress, addAmount)
    ).to.be.revertedWith("0 address is not allowed");
  });

  it("Test decreaseAllowance", async function () {
 
    const [owner, user1] = await ethers.getSigners();
    const startAmount = ethers.utils.parseEther("0.2");
    const subAmount = ethers.utils.parseEther("0.15");
    const endAmount = ethers.utils.parseEther("0.05");
    const nullAddress = "0x0000000000000000000000000000000000000000";

    await tokenContract.connect(owner).approve(user1.address, startAmount);
    await tokenContract.connect(owner).decreaseAllowance(user1.address, subAmount);

    const tx = await tokenContract.connect(owner).allowance(owner.address, user1.address);
    expect(tx).to.equal(endAmount);

    await expect(
      tokenContract.connect(user1).decreaseAllowance(user1.address, subAmount)
    ).to.be.revertedWith("subValue exceeds allowed amount");
    
    await expect(
      tokenContract.connect(user1).decreaseAllowance(nullAddress, subAmount)
    ).to.be.revertedWith("0 address is not allowed");
  });

});
