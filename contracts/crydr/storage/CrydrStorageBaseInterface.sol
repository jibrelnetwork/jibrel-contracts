/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


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
  event CrydrTransferEvent(address indexed from, address indexed to, uint value);
  event CrydrTransferFromEvent(address indexed spender, address indexed from, address indexed to, uint value);
  event CrydrApprovalEvent(address indexed owner, address indexed spender, uint value);


  /* Configuration */

  function setCrydrController(address _newController);
  function getCrydrController() constant returns (address);


  /* Low-level change of balance and getters. Implied that totalSupply kept in sync. */

  function increaseBalance(address _account, uint _value);
  function decreaseBalance(address _account, uint _value);
  function getBalance(address _account) constant returns (uint);
  function getTotalSupply() constant returns (uint);


  /* Low-level change of allowance and getters */

  function increaseAllowance(address _owner, address _spender, uint _value);
  function decreaseAllowance(address _owner, address _spender, uint _value);
  function getAllowance(address _owner, address _spender) constant returns (uint);
}
