/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


/**
 * @title CrydrStorageERC20Interface interface
 * @dev Interface of a contract that manages balance of an CryDR and have optimization for ERC20 controllers
 */
contract CrydrStorageERC20Interface {

  /* Events */

  event CrydrTransferEvent(address indexed from, address indexed to, uint value);
  event CrydrTransferFromEvent(address indexed spender, address indexed from, address indexed to, uint value);
  event CrydrSpendingApprovedEvent(address indexed owner, address indexed spender, uint value);


  /* ERC20 optimization. _msgsender - account that invoked CrydrView */

  function transfer(address _msgsender, address _to, uint _value);
  function transferFrom(address _msgsender, address _from, address _to, uint _value);
  function approve(address _msgsender, address _spender, uint _value);
}
