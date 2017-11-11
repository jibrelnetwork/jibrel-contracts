/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


/**
 * @title OwnableDelegated
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract OwnableDelegated {

  /* Storage */

  address owner;
  address newOwner = address(0x0);


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender account.
   */
  function OwnableDelegated(address _owner) {
    owner = _owner;
  }


  /**
   * @dev Throws if called by any account other than the current owner.
   */
  modifier onlyOwner() {
    require (msg.sender == owner);
    _;
  }


  /**
   * @dev Throws if called by any account other than the new owner.
   */
  modifier onlyNewOwner() {
    require (msg.sender == newOwner);
    _;
  }


  /**
   * @dev Old owner request transfer ownership to the new owner.
   * @param _newOwner The address to transfer ownership to.
   */
  function createOwnershipOffer(address _newOwner) onlyOwner {
    if (_newOwner != address(0)) {
      newOwner = _newOwner;
    }
  }


  /**
   * @dev Allows the new owner to accept an ownership offer to contract control.
   */
  function acceptOwnershipOffer() onlyNewOwner {
    owner = newOwner;
    newOwner = address(0);
  }


  /**
   * @dev The getter for "owner" contract variable
   */
  function getOwner() constant returns (address) {
    return owner;
  }
}
