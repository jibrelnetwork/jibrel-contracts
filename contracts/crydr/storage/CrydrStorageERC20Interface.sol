/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


/**
 * @title CrydrStorageERC20Interface interface
 * @dev Interface of a contract that manages balance of an CryDR and have optimization for ERC20 controllers
 */
contract CrydrStorageERC20Interface {

  /* Events */

  event CrydrTransferredEvent(address indexed from, address indexed to, uint256 value);
  event CrydrTransferredFromEvent(address indexed spender, address indexed from, address indexed to, uint256 value);
  event CrydrSpendingApprovedEvent(address indexed owner, address indexed spender, uint256 value);


  /* ERC20 optimization. _msgsender - account that invoked CrydrView */

  function transfer(address _msgsender, address _to, uint256 _value) external;
  function transferFrom(address _msgsender, address _from, address _to, uint256 _value) external;
  function approve(address _msgsender, address _spender, uint256 _value) external;
}
