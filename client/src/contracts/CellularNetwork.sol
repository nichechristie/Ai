// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CellularNetwork
 * @dev Contract for managing a decentralized cellular network
 */
contract CellularNetwork {
    address public owner;
    uint256 public rewardRate;
    uint256 public minConnectionQuality;
    uint256 public maxPeersPerNode;
    uint256 public networkTreasury;
    
    struct Validator {
        address walletAddress;
        bool isActive;
        uint256 signalStrength;
        uint256 dataRelayed;
        uint256 lastUpdateTime;
        uint256 rewards;
    }
    
    struct GovernanceProposal {
        uint256 id;
        address proposer;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        uint256 deadline;
    }
    
    mapping(address => Validator) public validators;
    address[] public validatorAddresses;
    GovernanceProposal[] public proposals;
    
    event ValidatorRegistered(address indexed validator);
    event ValidatorUpdated(address indexed validator, uint256 signalStrength, uint256 dataRelayed);
    event RewardsDistributed(address indexed validator, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, address proposer, string description);
    event ProposalVoted(uint256 indexed proposalId, address voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId);
    
    constructor(uint256 _initialRewardRate, uint256 _minQuality, uint256 _maxPeers) {
        owner = msg.sender;
        rewardRate = _initialRewardRate;
        minConnectionQuality = _minQuality;
        maxPeersPerNode = _maxPeers;
        networkTreasury = 0;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }
    
    modifier onlyValidator() {
        require(validators[msg.sender].isActive, "Not an active validator");
        _;
    }
    
    function registerValidator() external {
        require(validators[msg.sender].walletAddress == address(0), "Already registered");
        
        validators[msg.sender] = Validator({
            walletAddress: msg.sender,
            isActive: true,
            signalStrength: 0,
            dataRelayed: 0,
            lastUpdateTime: block.timestamp,
            rewards: 0
        });
        
        validatorAddresses.push(msg.sender);
        emit ValidatorRegistered(msg.sender);
    }
    
    function updateValidatorStatus(uint256 _signalStrength, uint256 _dataRelayed) external onlyValidator {
        require(_signalStrength <= 100, "Signal strength must be <= 100");
        
        Validator storage validator = validators[msg.sender];
        validator.signalStrength = _signalStrength;
        validator.dataRelayed += _dataRelayed;
        validator.lastUpdateTime = block.timestamp;
        
        // Calculate rewards
        if (_signalStrength >= minConnectionQuality) {
            uint256 rewardAmount = (_dataRelayed * rewardRate) / 1e18;
            validator.rewards += rewardAmount;
            emit RewardsDistributed(msg.sender, rewardAmount);
        }
        
        emit ValidatorUpdated(msg.sender, _signalStrength, _dataRelayed);
    }
    
    function getValidatorCount() external view returns (uint256) {
        return validatorAddresses.length;
    }
    
    function getActiveValidatorCount() external view returns (uint256) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < validatorAddresses.length; i++) {
            if (validators[validatorAddresses[i]].isActive) {
                activeCount++;
            }
        }
        return activeCount;
    }
    
    function createGovernanceProposal(string calldata _description) external onlyValidator {
        require(bytes(_description).length > 0, "Empty description");
        
        uint256 proposalId = proposals.length;
        proposals.push(GovernanceProposal({
            id: proposalId,
            proposer: msg.sender,
            description: _description,
            forVotes: 0,
            againstVotes: 0,
            executed: false,
            deadline: block.timestamp + 7 days
        }));
        
        emit ProposalCreated(proposalId, msg.sender, _description);
    }
    
    function voteOnProposal(uint256 _proposalId, bool _support) external onlyValidator {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        GovernanceProposal storage proposal = proposals[_proposalId];
        require(block.timestamp <= proposal.deadline, "Voting period ended");
        require(!proposal.executed, "Proposal already executed");
        
        if (_support) {
            proposal.forVotes += 1;
        } else {
            proposal.againstVotes += 1;
        }
        
        emit ProposalVoted(_proposalId, msg.sender, _support);
    }
    
    function executeProposal(uint256 _proposalId) external onlyOwner {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        GovernanceProposal storage proposal = proposals[_proposalId];
        require(!proposal.executed, "Proposal already executed");
        require(block.timestamp > proposal.deadline, "Voting period not ended");
        require(proposal.forVotes > proposal.againstVotes, "Proposal did not pass");
        
        proposal.executed = true;
        emit ProposalExecuted(_proposalId);
        
        // Implementation would depend on the proposal
    }
}