/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


/**
 * @title CrydrControllerERC20Interface interface
 * @dev Interface of a contract that implement business-logic of an ERC20 CryDR
 */
contract CrydrControllerERC20Interface {

  /* ERC20 support. _msgsender - account that invoked CrydrView */

  function transfer(address _msgsender, address _to, uint256 _value);
  function getTotalSupply() constant returns (uint256);
  function getBalance(address _owner) constant returns (uint256);

  function approve(address _msgsender, address _spender, uint256 _value);
  function transferFrom(address _msgsender, address _from, address _to, uint256 _value);
  function getAllowance(address _owner, address _spender) constant returns (uint256);
}
