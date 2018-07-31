/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


/**
 * @title CrydrControllerForcedTransferInterface interface
 * @dev Interface of a contract that allows manager to transfer funds from one account to another
 */
contract CrydrControllerForcedTransferInterface {

  /* Events */

  event ForcedTransferEvent(address indexed from, address indexed to, uint256 value);


  /* Methods */

  function forcedTransfer(address _from, address _to, uint256 _value) public;
  function forcedTransferAll(address _from, address _to) public;

}
