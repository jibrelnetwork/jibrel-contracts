/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {

  /* Storage */

  address owner = address(0x0);
  address proposedOwner = address(0x0);


  /* Events */

  event OwnerAssignedEvent(address indexed newowner);
  event OwnershipOfferCreatedEvent(address indexed currentowner, address indexed proposedowner);
  event OwnershipOfferAcceptedEvent(address indexed currentowner, address indexed proposedowner);
  event OwnershipOfferCancelledEvent(address indexed currentowner, address indexed proposedowner);


  /**
   * @dev The constructor sets the initial `owner` to the passed account.
   */
  function Ownable() public {
    owner = msg.sender;

    OwnerAssignedEvent(owner);
  }


  /**
   * @dev Throws if called by any account other than the current owner.
   */
  modifier onlyOwner() {
    require (msg.sender == owner);
    _;
  }


  /**
   * @dev Old owner requests transfer ownership to the new owner.
   * @param _proposedOwner The address to transfer ownership to.
   */
  function createOwnershipOffer(address _proposedOwner) external onlyOwner {
    require (proposedOwner == address(0x0));
    require (_proposedOwner != address(0x0));
    require (_proposedOwner != address(this));

    proposedOwner = _proposedOwner;

    OwnershipOfferCreatedEvent(owner, _proposedOwner);
  }


  /**
   * @dev Allows the new owner to accept an ownership offer to contract control.
   */
  //noinspection UnprotectedFunction
  function acceptOwnershipOffer() external {
    require (proposedOwner != address(0x0));
    require (msg.sender == proposedOwner);

    address _oldOwner = owner;
    owner = proposedOwner;
    proposedOwner = address(0x0);

    OwnerAssignedEvent(owner);
    OwnershipOfferAcceptedEvent(_oldOwner, owner);
  }


  /**
   * @dev Old owner cancels transfer ownership to the new owner.
   */
  function cancelOwnershipOffer() external {
    require (proposedOwner != address(0x0));
    require (msg.sender == owner || msg.sender == proposedOwner);

    address _oldProposedOwner = proposedOwner;
    proposedOwner = address(0x0);

    OwnershipOfferCancelledEvent(owner, _oldProposedOwner);
  }


  /**
   * @dev The getter for "owner" contract variable
   */
  function getOwner() public constant returns (address) {
    return owner;
  }

  /**
   * @dev The getter for "proposedOwner" contract variable
   */
  function getProposedOwner() public constant returns (address) {
    return proposedOwner;
  }
}
