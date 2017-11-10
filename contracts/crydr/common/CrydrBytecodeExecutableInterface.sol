/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


/**
 * @title CrydrBytecodeExecutableInterface interface
 * @dev Interface of a contract that implement executing any bytecode using contract`s private key
 */
contract CrydrBytecodeExecutableInterface {

  /* Events */

  event CrydrExecuteBytecodeEvent(address target, uint ethValue, bytes32 transactionBytecodeHash);


  /* executing bytecode */

  function executeBytecode(address _target, uint _ethValue, bytes _transactionBytecode);
}
