/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity >=0.4.0 <0.6.0;


/**
 * @title BytecodeExecutorInterface interface
 * @dev Implementation of a contract that execute any bytecode on behalf of the contract
 * @dev Last resort for the immutable and not-replaceable contract :)
 */
contract BytecodeExecutorInterface {

  /* Events */

  event CallExecutedEvent(address indexed target,
                          uint256 suppliedGas,
                          uint256 ethValue,
                          bytes32 transactionBytecodeHash);
  event DelegatecallExecutedEvent(address indexed target,
                                  uint256 suppliedGas,
                                  bytes32 transactionBytecodeHash);


  /* Functions */

  function executeCall(address _target, uint256 _suppliedGas, uint256 _ethValue, bytes calldata _transactionBytecode) external;
  function executeDelegatecall(address _target, uint256 _suppliedGas, bytes calldata _transactionBytecode) external;
}
