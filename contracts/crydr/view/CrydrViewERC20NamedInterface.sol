/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


/**
 * @title CrydrViewERC20NamedInterface
 * @dev Contract is able to set name/symbol/decimals
 */
contract CrydrViewERC20NamedInterface {

  function name() external constant returns (string);
  function symbol() external constant returns (string);
  function decimals() external constant returns (uint8);

  function getNameHash() external constant returns (bytes32);
  function getSymbolHash() external constant returns (bytes32);

  function setName(string _name) external;
  function setSymbol(string _symbol) external;
  function setDecimals(uint8 _decimals) external;
}
