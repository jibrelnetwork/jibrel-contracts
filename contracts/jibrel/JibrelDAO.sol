/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.11;


/**
 * @title JibrelDAOInterface
 * @dev Interface of the Jibrel DAO contract
 * @dev Purpose of this contract - manage contracts of the ERC20 tokens
 */
contract JibrelDAOInterface {

    // manage list of actions
    // required modifier - onlyBODCMember
    function addProposal(string _description, bytes _transactionBytecode) returns (uint256 _proposalId);
    function voteForProposal(uint256 _proposalId, bool _inSupport);
    function resolveProposal(uint256 _proposalId);
    // todo create tool to evaluate consequences or make the limited set of possible actions

    // get proposal info
    function getProposalDescription(uint256 _proposalId) returns (string _proposalDescription);
    function getProposalBytecode(uint256 _proposalId) returns (bytes _bytecode);
    function isProposalResolved(uint256 _proposalId) returns (bool _isResolved);
    function isProposalApproved(uint256 _proposalId) returns (bool _isApproved);

    // events
    event ProposalAddedEvent(uint256 indexed initiator, string description);
    event ProposalVotedEvent(uint256 indexed proposalId, address indexed voter, bool indexed inSupport);
    event ProposalResolvedEvent(uint256 indexed proposalId, bool indexed inSupport);
}
