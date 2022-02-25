import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";

task("get-info", "get name, symbol, decimals, totalSupply")
    .addParam("contract","smart contract address")
    .setAction (async (taskArgs, hre) => {
    
    const ERC20TokenFactory = await hre.ethers.getContractFactory("ERC20");
    const accounts = await hre.ethers.getSigners();

    const ERC20TokenContract = new hre.ethers.Contract(
        taskArgs.contract,
        ERC20TokenFactory.interface,
        accounts[0]
    );

    const name = await ERC20TokenContract.name();
    const symbol = await ERC20TokenContract.symbol();
    const decimals = await ERC20TokenContract.decimals();
    const totalSupply = await ERC20TokenContract.totalSupply();

    console.log(
        `info:
         name: ${name},
         symbol: ${symbol},
         decimals: ${decimals},
         totalSupply: ${totalSupply}`
    );
});

task("balance-of", "get balance by account address")
    .addParam("contract","smart contract address")
    .addParam("account"," account address")
    .setAction (async (taskArgs, hre) => {
    
    const ERC20TokenFactory = await hre.ethers.getContractFactory("ERC20");
    const accounts = await hre.ethers.getSigners();

    const ERC20TokenContract = new hre.ethers.Contract(
        taskArgs.contract,
        ERC20TokenFactory.interface,
        accounts[0]
    );

    const accountBalance = await ERC20TokenContract.balanceOf(taskArgs.account);

    console.log(`balance: ${accountBalance}`);
});

task("add-minter", "add new minter")
    .addParam("contract","contract address")
    .addParam("account","minter address")
    .setAction (async (taskArgs, hre) => {
    
    const ERC20TokenFactory = await hre.ethers.getContractFactory("ERC20");
    const accounts = await hre.ethers.getSigners();

    const ERC20TokenContract = new hre.ethers.Contract(
        taskArgs.contract,
        ERC20TokenFactory.interface,
        accounts[0]
    );

    const tx = await ERC20TokenContract.addMinter(taskArgs.account);

    console.log(`tx hash: ${tx.hash}`);
});

task("mint", "minting new coins to an account address")
    .addParam("contract","contract address")
    .addParam("account","account address")
    .addParam("value", "value (decimals=8)")
    .setAction (async (taskArgs, hre) => {
    
    const ERC20TokenFactory = await hre.ethers.getContractFactory("ERC20");
    const accounts = await hre.ethers.getSigners();

    const ERC20TokenContract = new hre.ethers.Contract(
        taskArgs.contract,
        ERC20TokenFactory.interface,
        accounts[0]
    );

    const convertValue =  hre.ethers.utils.parseEther(taskArgs.value);

    const tx = await ERC20TokenContract.mint(taskArgs.account, convertValue);

    console.log(`tx hash: ${tx.hash}`);
});

task("approve", "Allows spender to withdraw from your account value")
    .addParam("contract","contract address")
    .addParam("spender","spender address")
    .addParam("value", "value")
    .setAction (async (taskArgs, hre) => {
    
    const ERC20TokenFactory = await hre.ethers.getContractFactory("ERC20");
    const accounts = await hre.ethers.getSigners();

    const ERC20TokenContract = new hre.ethers.Contract(
        taskArgs.contract,
        ERC20TokenFactory.interface,
        accounts[0]
    );

    const convertValue =  hre.ethers.utils.parseEther(taskArgs.value);
    const tx = await ERC20TokenContract.approve(taskArgs.spender, convertValue);
    await tx.wait();

    const afterApprove = await ERC20TokenContract.allowance(accounts[0].address, taskArgs.spender);
    console.log(`after: ${afterApprove}`);
    console.log(`tx hash: ${tx.hash}`);
});

task("increase-allowance", "increases allowed value")
    .addParam("contract","contract address")
    .addParam("spender","spender address")
    .addParam("value", "value")
    .setAction (async (taskArgs, hre) => {
    
    const ERC20TokenFactory = await hre.ethers.getContractFactory("ERC20");
    const accounts = await hre.ethers.getSigners();

    const ERC20TokenContract = new hre.ethers.Contract(
        taskArgs.contract,
        ERC20TokenFactory.interface,
        accounts[0]
    );
    const beforeApprove = await ERC20TokenContract.allowance(accounts[0].address, taskArgs.spender);
    console.log(`before: ${beforeApprove}`);

    const convertValue =  hre.ethers.utils.parseEther(taskArgs.value);
    const tx = await ERC20TokenContract.increaseAllowance(taskArgs.spender, convertValue);
    await tx.wait();

    const afterApprove = await ERC20TokenContract.allowance(accounts[0].address, taskArgs.spender);
    console.log(`after: ${afterApprove}`);
    console.log(`tx hash: ${tx.hash}`);
});

task("decrease-allowance", "decrease allowed value")
    .addParam("contract","contract address")
    .addParam("spender","spender address")
    .addParam("value", "value")
    .setAction (async (taskArgs, hre) => {
    
    const ERC20TokenFactory = await hre.ethers.getContractFactory("ERC20");
    const accounts = await hre.ethers.getSigners();

    const ERC20TokenContract = new hre.ethers.Contract(
        taskArgs.contract,
        ERC20TokenFactory.interface,
        accounts[0]
    );
    const beforeApprove = await ERC20TokenContract.allowance(accounts[0].address, taskArgs.spender);
    console.log(`before: ${beforeApprove}`);

    const convertValue =  hre.ethers.utils.parseEther(taskArgs.value);
    const tx = await ERC20TokenContract.decreaseAllowance(taskArgs.spender, convertValue);
    await tx.wait();

    const afterApprove = await ERC20TokenContract.allowance(accounts[0].address, taskArgs.spender);
    console.log(`after: ${afterApprove}`);
    console.log(`tx hash: ${tx.hash}`);
});

task("transfer", "transfer tokens")
    .addParam("contract","contract address")
    .addParam("account","account address")
    .addParam("value", "value")
    .setAction (async (taskArgs, hre) => {
    
    const ERC20TokenFactory = await hre.ethers.getContractFactory("ERC20");
    const accounts = await hre.ethers.getSigners();

    const ERC20TokenContract = new hre.ethers.Contract(
        taskArgs.contract,
        ERC20TokenFactory.interface,
        accounts[0]
    );
    const beforeBalance = await ERC20TokenContract.balanceOf(accounts[0].address);
    console.log(`balance before: ${beforeBalance}`);

    const convertValue =  hre.ethers.utils.parseEther(taskArgs.value);
    const tx = await ERC20TokenContract.transfer(taskArgs.account, convertValue);
    await tx.wait();

    const afterBalance = await ERC20TokenContract.balanceOf(taskArgs.account);
    console.log(`after: ${afterBalance}`);
    console.log(`tx hash: ${tx.hash}`);
});

task("transfer-from", "transfer tokens by transferFrom and default accounts")
    .addParam("contract","contract address")
    .addParam("value", "value")
    .setAction (async (taskArgs, hre) => {
    
    const ERC20TokenFactory = await hre.ethers.getContractFactory("ERC20");
    const [owner, spender] = await hre.ethers.getSigners();
    const convertValue =  hre.ethers.utils.parseEther(taskArgs.value);

    const ERC20TokenContract = new hre.ethers.Contract(
        taskArgs.contract,
        ERC20TokenFactory.interface,
        owner
    );

    const spenderContract = new hre.ethers.Contract(
        taskArgs.contract,
        ERC20TokenFactory.interface,
        spender
    );

    const tx = await ERC20TokenContract.mint(owner.address, convertValue);
    await tx.wait();
    console.log(`owner:${owner.address}`);
    console.log(`spender:${spender.address}`);
    console.log(`minted: ${convertValue}`);
    
    const tx2 = await ERC20TokenContract.approve(spender.address, convertValue);
    await tx2.wait();
    console.log(`owner approve spender: ${tx.hash}`);

    const spenderBalance = await ERC20TokenContract.balanceOf(spender.address);
    const ownerBalance = await ERC20TokenContract.balanceOf(owner.address);
    console.log(`owner balance: ${ownerBalance}`);
    console.log(`spender balance: ${spenderBalance}`);

    const tx3 = await spenderContract.transferFrom(owner.address, spender.address, convertValue);
    await tx3.wait();
    
    const endSpenderBalance = await ERC20TokenContract.balanceOf(spender.address);
    const endOwnerBalance = await ERC20TokenContract.balanceOf(owner.address);
    console.log(`owner balance: ${endSpenderBalance}`);
    console.log(`spender balance: ${endOwnerBalance}`);

});

task("burn", "burn tokens")
    .addParam("contract","contract address")
    .addParam("value", "value")
    .setAction (async (taskArgs, hre) => {
    
    const ERC20TokenFactory = await hre.ethers.getContractFactory("ERC20");
    const [owner] = await hre.ethers.getSigners();
    const convertValue = await hre.ethers.utils.parseEther(taskArgs.value);

    const ERC20TokenContract = new hre.ethers.Contract(
        taskArgs.contract,
        ERC20TokenFactory.interface,
        owner
    );

    const totalSup = await ERC20TokenContract.totalSupply();
    const tokenBalance = await ERC20TokenContract.balanceOf(owner.address);

    console.log(`totalSupply:${totalSup}`);
    console.log(`tokenBalance:${tokenBalance}`);

    if (convertValue > tokenBalance) {
        console.log("burn value is very big");
    }
    else { 
        const tx = await ERC20TokenContract.burn(convertValue);
        await tx.wait();
        const endtotalSup = await ERC20TokenContract.totalSupply();
        const endtokenBalance = await ERC20TokenContract.balanceOf(owner.address);
        console.log("after:");
        console.log(`totalSupply:${endtotalSup}`);
        console.log(`tokenBalance:${endtokenBalance}`);
    }
});

export default {
    solidity: "0.8.4",
};