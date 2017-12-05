/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


/**
 * @title ERC20HashedInterface
 * @dev Contract is able to return hashes of 'name' and 'symbol'
 * @dev because it is not possible to pass strings between contracts.
 */
contract ERC20HashedInterface {
  function getNameHash() external constant returns (bytes32);
  function getSymbolHash() external constant returns (bytes32);
}
