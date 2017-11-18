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

  bool isExecuted = false;

  /* CrydrBytecodeExecutableInterface */

  function executeBytecode(
    address _target,
    uint _ethValue,
    bytes _transactionBytecode
  )
    onlyAllowedManager('execute_bytecode')
  {
    require(isExecuted == false);

    isExecuted = true; // Avoid recursive calling
    require(_target.call.value(_ethValue)(_transactionBytecode));
    isExecuted = false;

    CrydrExecuteBytecodeEvent(_target, _ethValue, sha3(_transactionBytecode));
  }
}
