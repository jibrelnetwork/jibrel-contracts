/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


/**
 * @title CrydrStorageBlocksInterface interface
 * @dev Interface of a contract that manages balance of an CryDR
 */
contract CrydrStorageBlocksInterface {

  /* Events */

  event AccountBlockedEvent(address indexed account);
  event AccountUnblockedEvent(address indexed account);
  event AccountFundsBlockedEvent(address indexed account, uint256 value);
  event AccountFundsUnblockedEvent(address indexed account, uint256 value);


  /* Low-level change of blocks and getters */

  function blockAccount(address _account) public;
  function unblockAccount(address _account) public;
  function getAccountBlocks(address _account) public constant returns (uint256);

  function blockAccountFunds(address _account, uint256 _value) public;
  function unblockAccountFunds(address _account, uint256 _value) public;
  function getAccountBlockedFunds(address _account) public constant returns (uint256);
}
