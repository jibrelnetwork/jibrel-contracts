/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


/**
 * @title CrydrStorageBaseInterface interface
 * @dev Interface of a contract that manages balance of an CryDR
 */
interface CrydrStorageAllowanceInterface {

  /* Events */

  event AccountAllowanceIncreasedEvent(address indexed owner, address indexed spender, uint256 value);
  event AccountAllowanceDecreasedEvent(address indexed owner, address indexed spender, uint256 value);


  /* Low-level change of allowance */

  function increaseAllowance(address _owner, address _spender, uint256 _value) public;
  function decreaseAllowance(address _owner, address _spender, uint256 _value) public;
  function getAllowance(address _owner, address _spender) public constant returns (uint256);
}
