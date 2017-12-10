/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract OwnableInterface {

  /* Events */

  event OwnerAssignedEvent(address indexed newowner);
  event OwnershipOfferCreatedEvent(address indexed currentowner, address indexed proposedowner);
  event OwnershipOfferAcceptedEvent(address indexed currentowner, address indexed proposedowner);
  event OwnershipOfferCancelledEvent(address indexed currentowner, address indexed proposedowner);


  /* Funcs */

  /**
   * @dev Throws if called by any account other than the current owner.
   */
  modifier onlyOwner() {
    require (msg.sender == getOwner());
    _;
  }

  /**
   * @dev The getter for "owner" contract variable
   */
  function getOwner() public constant returns (address);
}
