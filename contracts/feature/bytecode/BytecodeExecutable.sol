/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


import "../../lifecycle/Manageable.sol";
import "./BytecodeExecutableInterface.sol";


/**
 * @title BytecodeExecutable
 * @dev Implementation of a contract that execute any bytecode using contract`s private key
 */
contract BytecodeExecutable is BytecodeExecutableInterface, Manageable {

  /* Storage */

  bool underExecution = false;


  /* BytecodeExecutableInterface */

  function executeBytecode(
    address _target,
    uint _ethValue,
    bytes _transactionBytecode
  )
    onlyAllowedManager('execute_bytecode')
  {
    require(underExecution == false);

    underExecution = true; // Avoid recursive calling
    require(_target.call.value(_ethValue)(_transactionBytecode));
    underExecution = false;

    BytecodeExecutedEvent(_target, _ethValue, sha3(_transactionBytecode));
  }
}
