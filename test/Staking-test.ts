import { expect } from "chai";
import { ethers } from "hardhat";
import {ERC20__factory, StakingERC20__factory, ERC20, StakingERC20} from "../typechain";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

describe("StakingERC20-tests", function () {

  let stakeToken: ERC20;
  let rewardToken: ERC20;
  let stakingContract: StakingERC20;

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    const tokenFactory = await ethers.getContractFactory("ERC20",owner) as ERC20__factory;
    const stakingFactory = await ethers.getContractFactory("StakingERC20",owner) as StakingERC20__factory;

    stakeToken = await tokenFactory.deploy("StakeToken","STT");
    rewardToken = await tokenFactory.deploy("RewardToken","RWT");
    await stakeToken.deployed();
    await rewardToken.deployed();
    stakingContract = await stakingFactory.deploy(stakeToken.address, rewardToken.address);
    const toMint = ethers.utils.parseEther("1");

    stakeToken.connect(owner).mint(owner.address, toMint);
    rewardToken.connect(owner).mint(stakingContract.address, toMint);
  });

  it("Test stake", async function () {
    
    const [owner, addr1] = await ethers.getSigners();
    const toStake = ethers.utils.parseEther("0.1");
    const toAllow = ethers.utils.parseEther("0.2");
    const rewards = ethers.utils.parseEther("0.02"); //0.1*20% = 0.02
    await stakingContract.connect(owner).changeRewards(20, 5, 5);//20%, freeze time, reward every

    await expect(
        stakingContract.connect(owner).stake(toStake)
      ).to.be.revertedWith("not allowed amount");

    await stakeToken.connect(owner).approve(stakingContract.address, toAllow);
    await stakingContract.connect(owner).stake(toStake);
    expect(await stakingContract.stakingAmount(owner.address)).to.equal(toStake);

    await expect(
        stakingContract.connect(owner).stake(toStake)
      ).to.be.revertedWith("0 reward");

    await delay(5000);
    await stakingContract.connect(owner).stake(toStake);
    const balAfter = await rewardToken.connect(owner).balanceOf(owner.address);

    expect(balAfter).to.equal(rewards);
  });

  it("Test claim", async function () {
    
    const [owner, addr1] = await ethers.getSigners();
    const toMint = ethers.utils.parseEther("10000");
    await stakingContract.connect(owner).changeRewards(20, 2, 5);

    await stakeToken.connect(owner).mint(owner.address, toMint);
    await stakeToken.connect(owner).approve(stakingContract.address, toMint);
    await stakingContract.connect(owner).stake(toMint);

    await delay(5000);

    await expect(
        stakingContract.connect(owner).claim()
      ).to.be.revertedWith("not enough rewardTokens in the smart contract");
  });

  it("Test unstake", async function () {
    
    const [owner, addr1] = await ethers.getSigners();
    const toStake = ethers.utils.parseEther("0.1");
    const startAmount = ethers.utils.parseEther("1");
    await stakingContract.connect(owner).changeRewards(20, 5, 5);

    await expect(
        stakingContract.connect(owner).unstake()
      ).to.be.revertedWith("stakingAmount must be more than 0");

    await stakeToken.connect(owner).approve(stakingContract.address, toStake);
    await stakingContract.connect(owner).stake(toStake);

    await expect(
        stakingContract.connect(owner).unstake()
      ).to.be.revertedWith("freeze time is not end");
    
    await delay(5000);

    await stakingContract.connect(owner).unstake();
    const balAfter = await stakeToken.balanceOf(owner.address);
    
  });

  it("Test addAdmin, delAdmin and modifier", async function () {
    
    const [owner, addr1] = await ethers.getSigners();
    await expect(
        stakingContract.connect(addr1).changeRewards(20, 10, 20)
      ).to.be.revertedWith("you are not an admin");
    await expect(
        stakingContract.connect(addr1).addAdmin(owner.address)
      ).to.be.revertedWith("you are not an owner");
    await stakingContract.connect(owner).addAdmin(addr1.address);
    await stakingContract.connect(owner).delAdmin(addr1.address);
  });

});
