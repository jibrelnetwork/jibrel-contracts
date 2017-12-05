/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


/**
 * @title ERC20NamedInterface
 * @dev Interface of the token that has properties 'name', 'symbol', 'decimals'.
 * @dev Contract is able to return hashes of 'name' and 'symbol'
 * @dev because it is not possible to pass strings between contracts.
 * todo think about https://en.wikipedia.org/wiki/ISO_4217
 */
contract ERC20NamedInterface {
  function name() external constant returns (string);
  function symbol() external constant returns (string);
  function decimals() external constant returns (uint8);

  function setName(string _name) external;
  function setSymbol(string _symbol) external;

  function getNameHash() external constant returns (bytes32);
  function getSymbolHash() external constant returns (bytes32);
}
