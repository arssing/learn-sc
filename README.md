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
npx hardhat stake --contract 0x0EA182CBD955AB2C2A7f2cda0f9A18efe1432ff1 --amount 0.1 --network rinkeby
npx hardhat claim --contract 0x0EA182CBD955AB2C2A7f2cda0f9A18efe1432ff1 --network rinkeby
npx hardhat unstake --contract 0x0EA182CBD955AB2C2A7f2cda0f9A18efe1432ff1 --network rinkeby
```
