/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.18;


/**
 * @title CommonModifiers
 * @dev Base contract which contains common checks.
 */
contract CommonModifiersInterface {

  /**
   * @dev Assemble the given address bytecode. If bytecode exists then the _addr is a contract.
   */
  function isContract(address _targetAddress) internal constant returns (bool);

  /**
   * @dev modifier to allow actions only when the _targetAddress is a contract.
   */
  modifier onlyContractAddress(address _targetAddress) {
    require(isContract(_targetAddress) == true);
    _;
  }
}
