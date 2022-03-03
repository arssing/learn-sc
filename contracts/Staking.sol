//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract StakingERC20 {
    mapping(address => uint) public stakingAmount;
    mapping(address => uint) startTime;
    mapping(address => bool) isAdmin;

    uint public percent = 20;
    uint public freezeTimeSeconds = 1200;
    uint public rewardEverySeconds = 600;
    address owner;
    IERC20 stakingToken;
    IERC20 rewardToken;

    constructor(address _stakingToken, address _rewardToken) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
        owner = msg.sender;
        isAdmin[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "you are not an owner");
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "you are not an admin");
        _;
    }

    function addAdmin(address addr) public onlyOwner {
        isAdmin[addr] = true;
    }

    function delAdmin(address addr) public onlyOwner {
        isAdmin[addr] = false;
    }

    function stake(uint amount) public {

        if (stakingAmount[msg.sender] > 0) {
            claim();
        }

        uint allow = stakingToken.allowance(msg.sender, address(this));
        require(allow >= amount, "not allowed amount");

        stakingToken.transferFrom(msg.sender, address(this), amount);
        startTime[msg.sender] = block.timestamp;
        stakingAmount[msg.sender] += amount;
    }

    function claim() public {
        uint reward = calculateReward();
        require(reward > 0, "0 reward");
        require(rewardToken.balanceOf(address(this)) >= reward, "not enough rewardTokens in the smart contract");
        rewardToken.transfer(msg.sender, reward);
    }

    function unstake() public {
        uint nowStake = stakingAmount[msg.sender];
        require(nowStake > 0, "stakingAmount must be more than 0");

        uint endTime = block.timestamp;
        uint checkFreeze = endTime - startTime[msg.sender];
        require(checkFreeze > freezeTimeSeconds, "freeze time is not end");
        
        stakingAmount[msg.sender] = 0;
        stakingToken.transfer(msg.sender, nowStake);
    }

    function calculateReward() internal view returns (uint) {
        uint endTime = block.timestamp;
        uint rewardTime = (endTime - startTime[msg.sender]) / rewardEverySeconds;
        uint reward = rewardTime * stakingAmount[msg.sender] * percent/100;
        return reward;
    }
    
    function changeRewards(uint _percent, uint _freezeTimeSeconds, uint _rewardEverySeconds) public onlyAdmin {
        percent = _percent;
        freezeTimeSeconds = _freezeTimeSeconds;
        rewardEverySeconds = _rewardEverySeconds;
    }
}