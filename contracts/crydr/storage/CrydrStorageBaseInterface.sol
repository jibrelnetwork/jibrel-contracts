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


  /* Configuration */

  function setCrydrController(address _newController) external;
  function getCrydrController() external constant returns (address);


  /* Low-level change of balance. Implied that totalSupply kept in sync. */

  function increaseBalance(address _account, uint _value) external;
  function decreaseBalance(address _account, uint _value) external;
  function getBalance(address _account) external constant returns (uint);
  function getTotalSupply() external constant returns (uint);


  /* Low-level change of allowance */

  function increaseAllowance(address _owner, address _spender, uint _value) external;
  function decreaseAllowance(address _owner, address _spender, uint _value) external;
  function getAllowance(address _owner, address _spender) external constant returns (uint);
}
