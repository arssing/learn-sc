# ERC721, ERC1155
opensea: [ERC721](https://testnets.opensea.io/collection/kozinaktoken), [ERC1155](https://testnets.opensea.io/collection/unidentified-contract-xmwbp2m6ok)
etherscan: [ERC721](https://rinkeby.etherscan.io/address/0x0851067c85b5ed81cf16bd66144bb2ccc1ebf592), [ERC1155](https://rinkeby.etherscan.io/address/0x16de4d0950ddcb3bfd19bf11ed8343bc3050e9f3)
# Deploy
```
npx hardhat run scripts/deploy-Stake.ts --network rinkeby
```
# Test
```
npx hardhat coverage
```
# Tasks

```
npx hardhat mint-erc721
npx hardhat mint-erc1155
npx hardhat stake --contract 0x0EA182CBD955AB2C2A7f2cda0f9A18efe1432ff1 --amount 0.1 --network rinkeby
npx hardhat claim --contract 0x0EA182CBD955AB2C2A7f2cda0f9A18efe1432ff1 --network rinkeby
npx hardhat unstake --contract 0x0EA182CBD955AB2C2A7f2cda0f9A18efe1432ff1 --network rinkeby
```
