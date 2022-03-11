import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";

task("mint-erc721", "mint erc721 token")
    .addParam("contract","ERC721 smart contract address")
    .addParam("recipient","nft recipient")
    .addParam("uri","URI for NFT")
    .setAction (async (taskArgs, hre) => {
    
    const ERC721TokenFactory = await hre.ethers.getContractFactory("NFT721");
    const accounts = await hre.ethers.getSigners();

    const ERC721TokenContract = new hre.ethers.Contract(
        taskArgs.contract,
        ERC721TokenFactory.interface,
        accounts[0]
    );

    const tx = await ERC721TokenContract.mint(taskArgs.recipient, taskArgs.uri);
    console.log(`tx hash: ${tx.hash}`);
});

task("mint-erc1155", "mint erc1155 token")
    .addParam("contract","ERC721 smart contract address")
    .addParam("tokenid","token id type")
    .addParam("amount","amount of tokens")
    .setAction (async (taskArgs, hre) => {
    
    const ERC1155TokenFactory = await hre.ethers.getContractFactory("NFT1155");
    const accounts = await hre.ethers.getSigners();

    const ERC1155TokenContract = new hre.ethers.Contract(
        taskArgs.contract,
        ERC1155TokenFactory.interface,
        accounts[0]
    );

    const tx = await ERC1155TokenContract.mint(taskArgs.tokenid, taskArgs.amount);
    console.log(`tx hash: ${tx.hash}`);
});

export default {
    solidity: "0.8.4",
};