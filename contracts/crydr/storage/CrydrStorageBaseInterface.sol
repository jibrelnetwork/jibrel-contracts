/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


/**
 * @title CrydrStorageBaseInterface interface
 * @dev Interface of a contract that manages balance of an CryDR
 */
contract CrydrStorageBaseInterface {

  /* Events */

  event CrydrControllerChangedEvent(address indexed crydrcontroller);
  event AccountBalanceIncreasedEvent(address indexed account, uint value);
  event AccountBalanceDecreasedEvent(address indexed account, uint value);
  event AccountAllowanceIncreasedEvent(address indexed owner, address indexed spender, uint value);
  event AccountAllowanceDecreasedEvent(address indexed owner, address indexed spender, uint value);
  event AccountBlockedEvent(address indexed account);
  event AccountUnblockedEvent(address indexed account);
  event AccountFundsBlockedEvent(address indexed account, uint value);
  event AccountFundsUnblockedEvent(address indexed account, uint value);


  /* Configuration */

  function setCrydrController(address _newController);
  function getCrydrController() constant returns (address);


  /* Low-level change of balance. Implied that totalSupply kept in sync. */

  function increaseBalance(address _account, uint _value);
  function decreaseBalance(address _account, uint _value);
  function getBalance(address _account) constant returns (uint);
  function getTotalSupply() constant returns (uint);


  /* Low-level change of allowance */

  function increaseAllowance(address _owner, address _spender, uint _value);
  function decreaseAllowance(address _owner, address _spender, uint _value);
  function getAllowance(address _owner, address _spender) constant returns (uint);


  /* Low-level change of blocks and getters */

  function blockAccount(address _account);
  function unblockAccount(address _account);
  function getAccountBlocks(address _account) constant returns (uint);

  function blockAccountFunds(address _account, uint _value);
  function unblockAccountFunds(address _account, uint _value);
  function getAccountBlockedFunds(address _account) constant returns (uint);
}
