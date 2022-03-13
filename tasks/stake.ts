import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";

task("stake", "stake tokens")
    .addParam("contract","smart contract address")
	.addParam("amount","amount of tokens")
    .setAction (async (taskArgs, hre) => {
    
    const stakingFactory = await hre.ethers.getContractFactory("StakingERC20");
    const accounts = await hre.ethers.getSigners();

    const stakingContract = new hre.ethers.Contract(
        taskArgs.contract,
        stakingFactory.interface,
        accounts[0]
    );
	const balBefore = (await stakingContract.stakers(accounts[0].address)).amount;
    const tx = await stakingContract.stake(hre.ethers.utils.parseEther(taskArgs.amount));
	await tx.wait();
    const balAfter = (await stakingContract.stakers(accounts[0].address)).amount;
    
    console.log(`tx hash: ${tx.hash}`);
    console.log(`before: ${hre.ethers.utils.formatEther(balBefore)}`);
    console.log(`after: ${hre.ethers.utils.formatEther(balAfter)}`);
});

task("claim", "claim rewards")
    .addParam("contract","smart contract address")
    .setAction (async (taskArgs, hre) => {
    
    const stakingFactory = await hre.ethers.getContractFactory("StakingERC20");
    const accounts = await hre.ethers.getSigners();

    const stakingContract = new hre.ethers.Contract(
        taskArgs.contract,
        stakingFactory.interface,
        accounts[0]
    );
	
    const tx = await stakingContract.claim();
	await tx.wait();
    
    console.log(`tx hash: ${tx.hash}`);
});

task("unstake", "unstake lp tokens")
    .addParam("contract","smart contract address")
    .setAction (async (taskArgs, hre) => {
    
    const stakingFactory = await hre.ethers.getContractFactory("StakingERC20");
    const accounts = await hre.ethers.getSigners();

    const stakingContract = new hre.ethers.Contract(
        taskArgs.contract,
        stakingFactory.interface,
        accounts[0]
    );
	
    const tx = await stakingContract.unstake();
	await tx.wait();
    
    console.log(`tx hash: ${tx.hash}`);
});

export default {
    solidity: "0.8.4",
};