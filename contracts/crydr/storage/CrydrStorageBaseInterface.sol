/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


/**
 * @title CrydrStorageBaseInterface interface
 * @dev Interface of a contract that manages balance of an CryDR
 */
contract CrydrStorageBaseInterface {

  /* Events */

  event CrydrControllerChangedEvent(address indexed crydrcontroller);
  event AccountBalanceIncreasedEvent(address indexed account, uint256 value);
  event AccountBalanceDecreasedEvent(address indexed account, uint256 value);
  event AccountAllowanceIncreasedEvent(address indexed owner, address indexed spender, uint256 value);
  event AccountAllowanceDecreasedEvent(address indexed owner, address indexed spender, uint256 value);
  event AccountBlockedEvent(address indexed account);
  event AccountUnblockedEvent(address indexed account);
  event AccountFundsBlockedEvent(address indexed account, uint256 value);
  event AccountFundsUnblockedEvent(address indexed account, uint256 value);


  /* Configuration */

  function setCrydrController(address _newController);
  function getCrydrController() constant returns (address);


  /* Low-level change of balance. Implied that totalSupply kept in sync. */

  function increaseBalance(address _account, uint256 _value);
  function decreaseBalance(address _account, uint256 _value);
  function getBalance(address _account) constant returns (uint256);
  function getTotalSupply() constant returns (uint256);


  /* Low-level change of allowance */

  function increaseAllowance(address _owner, address _spender, uint256 _value);
  function decreaseAllowance(address _owner, address _spender, uint256 _value);
  function getAllowance(address _owner, address _spender) constant returns (uint256);


  /* Low-level change of blocks and getters */

  function blockAccount(address _account);
  function unblockAccount(address _account);
  function getAccountBlocks(address _account) constant returns (uint256);

  function blockAccountFunds(address _account, uint256 _value);
  function unblockAccountFunds(address _account, uint256 _value);
  function getAccountBlockedFunds(address _account) constant returns (uint256);
}
