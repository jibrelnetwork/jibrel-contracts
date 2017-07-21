/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.11;


/**
 * @title ERC20NamedInterface
 * @dev Interface of the token that has properties 'name', 'symbol', 'decimals'.
 * @dev Contract is able to return hashes of 'name' and 'symbol'
 * @dev because it is not possible to pass strings between contracts.
 * todo think about https://en.wikipedia.org/wiki/ISO_4217
 */
contract ERC20NamedInterface {
  function name() constant returns (string);
  function symbol() constant returns (string);
  function decimals() constant returns (uint32);

  function getNameHash() constant returns (bytes32);
  function getSymbolHash() constant returns (bytes32);
}
