/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


/**
 * @title BytecodeExecutableInterface interface
 * @dev Interface of a contract that implement executing any bytecode using contract`s private key
 */
contract BytecodeExecutableInterface {

  /* Events */

  event BytecodeExecutedEvent(address indexed target, uint ethValue, bytes32 transactionBytecodeHash);


  /* Functions */

  function executeBytecode(address _target, uint _ethValue, bytes _transactionBytecode);
}
