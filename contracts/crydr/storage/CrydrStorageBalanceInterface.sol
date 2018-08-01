/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


/**
 * @title CrydrStorageBalanceInterface interface
 * @dev Interface of a contract that manages balance of an CryDR
 */
contract CrydrStorageBalanceInterface {

  /* Events */

  event AccountBalanceIncreasedEvent(address indexed account, uint256 value);
  event AccountBalanceDecreasedEvent(address indexed account, uint256 value);


  /* Low-level change of balance. Implied that totalSupply kept in sync. */

  function increaseBalance(address _account, uint256 _value) public;
  function decreaseBalance(address _account, uint256 _value) public;
  function getBalance(address _account) public constant returns (uint256);
  function getTotalSupply() public constant returns (uint256);
}
