/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


/**
 * @title BODC
 * @dev Stores list of members of Board of Directors of the Jibrel company
 */
contract BODC {

  /* Structs */

  struct MemberInfo {
    address memberAddress;
    string memberName;
    bool isActive;
  }

  struct MemberProposal {
    address memberAddress;
    string memberName;
    bool inSupport;
  }


  /* Storage */

  MemberInfo[] public memberInfo;
  uint256 membersNumber;

  MemberProposal[] memberProposals;
  uint256 proposalsNumber;


  /* Events */

  event ProposalForNewMemberEvent(address indexed initiator, address indexed newMemberAddress, string indexed newMemberName);
  event ProposalForDismissMemberEvent(address indexed initiator, uint256 indexed dismissedMemberId);
  event ProposalForMembershidVotedEvent(address indexed voter, bool indexed inSupport);
  event NewMemberApprovedEvent(address indexed newMemberId, address indexed newMemberAddress, string indexed newMemberName);
  event MemberDismissedEvent(address indexed dismissedMemberId, address indexed dismissedMemberAddress, string indexed dismissedMemberName);
  event MemberLeavedEvent(address indexed leavedMemberId, address indexed leavedMemberAddress, string indexed leavedMemberName);


  /* Constructor */

  function BODC(string _initialMemberName) {
    membersNumber = 1;
    memberInfo.length += 1;
    memberInfo[0].memberAddress = msg.sender;
    memberInfo[0].memberName = _initialMemberName;
    memberInfo[0].isActive = true;
  }


  /* Getters */

  /**
   * @dev Function to get number of active members
   * @return Number of active BODC members
   */
  function getActiveMembersNumber() constant returns (uint256 _number) {
    _number = 0;
    for (uint i = 0; i < membersNumber; i++) {
      if (memberInfo[i].isActive) {
        _number += 1;
      }
    }
    return _number;
  }

  /**
   * @dev Function to get name of the BODC member
   * @param _member address Target address
   * @return Name of the member
   */
  function getBODCMemberName(address _member) constant returns (string _memberName) {
    for (uint i = 0; i < membersNumber; i++) {
      if (memberInfo[i].memberAddress == _member) {
        return memberInfo[i].memberName;
      }
    }
    assert(false);
  }

  /**
   * @dev Function to check whether address is the active member of BODC or not
   * @param _member address Target address
   * @return True if address is the active member of BODC
   */
  function isActiveMember(address _member) constant returns (bool _isActive) {
    for (uint i = 0; i < membersNumber; i++) {
      if (memberInfo[i].memberAddress == _member) {
        return memberInfo[i].isActive;
      }
    }
    assert(false);
  }

  /**
   * @dev Function to get membersNumber of BODC member
   */
  function getMembersNumber() public constant returns (uint256) {
    return membersNumber;
  }

  /**
   * @dev Function to get proposalsNumber of BODC member
   */
  function getProposalsNumber() public constant returns (uint256) {
    return proposalsNumber;
  }

  /* Manage members of Board of Directors */

  // function proposeNewMember(address _memberAddress, string _memberName) onlyMember returns (uint256 _proposalId);
  // function proposeDismissMember(address _memberAddress) onlyMember returns (uint256 _proposalId);
  // function voteForProposal(uint256 _proposalId, bool _inSupport) onlyMember;
  // function resolveProposal(uint256 _proposalId) onlyMember;
  // function leaveBODC() onlyMember;



  /**
   * @dev Modifier to prohibit actions to non-members
   */
  modifier onlyMember() {
    require(isActiveMember(msg.sender) == true);
    _;
  }
}
