/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


import "../../lifecycle/Manageable.sol";
import "./CrydrBytecodeExecutableInterface.sol";


/**
 * @title CrydrBytecodeExecutable
 * @dev Implementation of a contract that execute any bytecode using contract`s private key
 */
contract CrydrBytecodeExecutable is CrydrBytecodeExecutableInterface, Manageable {

  /* Storage */

  bool underExecution = false;


  /* CrydrBytecodeExecutableInterface */

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

    CrydrBytecodeExecutedEvent(_target, _ethValue, sha3(_transactionBytecode));
  }
}
