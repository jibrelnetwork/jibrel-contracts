/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


/**
 * @title ERC20ConfigurableInterface
 * @dev Contract is able to set name/symbol/decimals
 */
contract ERC20ConfigurableInterface {
  function setName(string _name) external;
  function setSymbol(string _symbol) external;
  function setDecimals(uint8 _decimals) external;
}
