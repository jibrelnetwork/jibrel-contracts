/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


/**
 * @title CrydrConditions
 * @dev Base contract which checks and allows some actions with contracts.
 */
contract CrydrModifiers {

  /* Helpers */

  /**
   * @dev Assemble the given address bytecode. If bytecode exists then the _addr is a contract.
   */
  function isContract(address _addr) internal returns (bool _isContract) {
    _addr = _addr; // to avoid warnings during compilation

    uint256 length;
    assembly {
      //retrieve the size of the code on target address, this needs assembly
      length := extcodesize(_addr)
    }
    return (length > 0);
  }

  /**
   * @dev modifier to allow actions only when the _addr is a contract.
   */
  modifier whenIsContractAddress(address _addr) {
    require(isContract(_addr) == true);
    _;
  }
}
