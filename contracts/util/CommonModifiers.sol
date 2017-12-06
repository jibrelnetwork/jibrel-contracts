/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


/**
 * @title CommonModifiers
 * @dev Base contract which contains common checks.
 */
contract CommonModifiers {

  /* Helpers */

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

  /**
   * @dev modifier to allow actions only when the _targetAddress is a contract.
   */
  modifier onlyContractAddress(address _targetAddress) {
    require(isContract(_targetAddress) == true);
    _;
  }
}
