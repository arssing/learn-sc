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
    stakingContract = await stakingFactory.deploy(stakeToken.address, rewardToken.address, 2222, 4, 2, 10);
    const toMint = ethers.utils.parseEther("1");

    stakeToken.connect(owner).mint(owner.address, toMint);
    rewardToken.connect(owner).mint(stakingContract.address, toMint);
  });

  it("Test stake", async function () {
    
    const [owner, addr1] = await ethers.getSigners();
    const toStake = ethers.utils.parseEther("0.1");
    const toAllow = ethers.utils.parseEther("0.2");
    const rewards = ethers.utils.parseEther("0.02222"); //0.1*22.22% = 0.02222

    await expect(
        stakingContract.connect(owner).stake(toStake)
      ).to.be.revertedWith("StakingERC20::stake:not allowed amount");

    await stakeToken.connect(owner).approve(stakingContract.address, toAllow);
    await stakingContract.connect(owner).stake(toStake);
    const nowStake = (await stakingContract.stakers(owner.address)).amount;
    expect(nowStake).to.equal(toStake);

    await expect(
        stakingContract.connect(owner).stake(toStake)
      ).to.be.revertedWith("StakingERC20::claim:freeze time is not end");

    await delay(2000);

    await expect(
      stakingContract.connect(owner).stake(toStake)
    ).to.be.revertedWith("StakingERC20::claim:0 reward");

    await delay(2000);
    
    await stakingContract.connect(owner).stake(toStake);
    const balAfter = await rewardToken.connect(owner).balanceOf(owner.address);

    expect(balAfter).to.equal(rewards);
  });
  
  it("Test claim", async function () {
    
    const [owner, addr1] = await ethers.getSigners();
    const toMint = ethers.utils.parseEther("10000");

    await stakeToken.connect(owner).mint(owner.address, toMint);
    await stakeToken.connect(owner).approve(stakingContract.address, toMint);
    await stakingContract.connect(owner).stake(toMint);
    await stakingContract.connect(owner).changeRewards(3333, 1, 1, 1);

    await delay(1000);

    await expect(
        stakingContract.connect(owner).claim()
      ).to.be.revertedWith("StakingERC20::claim:not enough rewardTokens");
  });

  it("Test unstake", async function () {
    
    const [owner, addr1] = await ethers.getSigners();
    const toStake = ethers.utils.parseEther("0.1");
    const startAmount = ethers.utils.parseEther("1");
    await stakingContract.connect(owner).changeRewards(3333, 1, 2, 3);

    await expect(
        stakingContract.connect(owner).unstake()
      ).to.be.revertedWith("StakingERC20::unstake:amount must be more than 0");

    await stakeToken.connect(owner).approve(stakingContract.address, toStake);
    await stakingContract.connect(owner).stake(toStake);

    await expect(
        stakingContract.connect(owner).unstake()
      ).to.be.revertedWith("StakingERC20::unstake:freeze time is not end");
    
    await delay(3000);

    await stakingContract.connect(owner).unstake();
    const balAfter = await stakeToken.balanceOf(owner.address);
    
  });

});
