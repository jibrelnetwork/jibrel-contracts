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
  function unlockAccount(address _account);
  function getBlockAccount(address _account) constant returns (uint);
  function blockFunds(address _account, uint _value);
  function unlockFunds(address _account, uint _value);
  function getBlockFunds(address _account) constant returns (uint);
}
