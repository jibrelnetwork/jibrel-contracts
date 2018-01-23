/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
interface OwnableInterface {

  /**
   * @dev The getter for "owner" contract variable
   */
  function getOwner() public constant returns (address);
}
