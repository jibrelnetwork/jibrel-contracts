/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.18;

import './CommonModifiersInterface.sol';


/**
 * @title CommonModifiers
 * @dev Base contract which contains common checks.
 */
contract CommonModifiers is CommonModifiersInterface {

  /**
   * @dev Assemble the given address bytecode. If bytecode exists then the _addr is a contract.
   */
  function isContract(address _targetAddress) internal constant returns (bool) {
    require (_targetAddress != address(0x0));

    uint256 length;
    assembly {
      //retrieve the size of the code on target address, this needs assembly
      length := extcodesize(_targetAddress)
    }
    return (length > 0);
  }
}
