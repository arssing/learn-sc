//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingERC20 is Ownable {

    struct Staker {
        uint amount;
        uint startTime;
    }
    mapping(address => Staker) public stakers;

    uint public percent;
    uint public freezeClaimSeconds;
    uint public freezeUnstakeSeconds;
    uint public rewardEverySeconds;
    uint public percentDivider = 10000;

    IERC20 stakingToken;
    IERC20 rewardToken;

    constructor(address _stakingToken, address _rewardToken, uint _percent, uint _rewardEvery, uint _freezeClaim, uint _freezeUnstake) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
        percent = _percent;
        rewardEverySeconds = _rewardEvery;
        freezeClaimSeconds = _freezeClaim;
        freezeUnstakeSeconds = _freezeUnstake;
    }

    function stake(uint amount) public {

        if (stakers[msg.sender].amount != 0) {
            claim();
        }

        uint allow = stakingToken.allowance(msg.sender, address(this));
        require(allow >= amount, "StakingERC20::stake:not allowed amount");

        stakingToken.transferFrom(msg.sender, address(this), amount);
        stakers[msg.sender].startTime = block.timestamp;
        stakers[msg.sender].amount += amount;
    }

    function claim() public {
        require(block.timestamp - stakers[msg.sender].startTime > freezeClaimSeconds, "StakingERC20::claim:freeze time is not end");

        uint reward = calculateReward();
        require(reward > 0, "StakingERC20::claim:0 reward");
        require(rewardToken.balanceOf(address(this)) >= reward, "StakingERC20::claim:not enough rewardTokens");
        rewardToken.transfer(msg.sender, reward);
    }

    function unstake() public {
        uint nowStake = stakers[msg.sender].amount;
        require(nowStake > 0, "StakingERC20::unstake:amount must be more than 0");
        require(block.timestamp - stakers[msg.sender].startTime > freezeUnstakeSeconds, "StakingERC20::unstake:freeze time is not end");
        
        stakers[msg.sender].amount = 0;
        stakingToken.transfer(msg.sender, nowStake);
    }

    function calculateReward() internal view returns (uint) {
        uint rewardTime = (block.timestamp - stakers[msg.sender].startTime) / rewardEverySeconds;
        uint reward = rewardTime * stakers[msg.sender].amount * percent / percentDivider;
        return reward;
    }
    
    function changeRewards(uint _percent, uint _rewardEverySeconds, uint _freezeClaim, uint _freezeUnstake) public onlyOwner{
        percent = _percent;
        rewardEverySeconds = _rewardEverySeconds;
        freezeClaimSeconds = _freezeClaim;
        freezeUnstakeSeconds = _freezeUnstake;
    }
}