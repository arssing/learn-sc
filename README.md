# ERC721, ERC1155
opensea: [ERC721](https://testnets.opensea.io/collection/kozinaktoken), [ERC1155](https://testnets.opensea.io/collection/unidentified-contract-xmwbp2m6ok)

etherscan: [ERC721](https://rinkeby.etherscan.io/address/0x0851067c85b5ed81cf16bd66144bb2ccc1ebf592), [ERC1155](https://rinkeby.etherscan.io/address/0x16de4d0950ddcb3bfd19bf11ed8343bc3050e9f3)
# Staking
[uniswap pair](https://rinkeby.etherscan.io/address/0x1a8a589AF81cb69cbF932fE6267D9a9F4FffBC66)

[reward token](https://rinkeby.etherscan.io/address/0xd86c499d3c284e80558f343aa1b87e0e18c77d66)

[Staking](https://rinkeby.etherscan.io/address/0x74c801febfa10b82ed8524d7019e00ebee8defe7)
# Tasks

```
npx hardhat stake --contract 0x74C801feBfA10b82ed8524D7019E00EBEE8DefE7 --amount 0.23 --network rinkeby
npx hardhat claim --contract 0x74C801feBfA10b82ed8524D7019E00EBEE8DefE7 --network rinkeby
npx hardhat unstake --contract 0x74C801feBfA10b82ed8524D7019E00EBEE8DefE7 --network rinkeby
npx hardhat stake --contract 0x0EA182CBD955AB2C2A7f2cda0f9A18efe1432ff1 --amount 0.1 --network rinkeby
npx hardhat claim --contract 0x0EA182CBD955AB2C2A7f2cda0f9A18efe1432ff1 --network rinkeby
npx hardhat unstake --contract 0x0EA182CBD955AB2C2A7f2cda0f9A18efe1432ff1 --network rinkeby
npx hardhat mint-erc721
npx hardhat mint-erc1155
```
# Tests
```
npx hardhat coverage
```
