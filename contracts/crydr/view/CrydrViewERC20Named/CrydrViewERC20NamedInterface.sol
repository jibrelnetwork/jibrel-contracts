/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


/**
 * @title CrydrViewERC20NamedInterface
 * @dev Contract is able to set name/symbol/decimals
 */
contract CrydrViewERC20NamedInterface {

  function name() external view returns (string memory);
  function symbol() external view returns (string memory);
  function decimals() external view returns (uint8);

  function getNameHash() external view returns (bytes32);
  function getSymbolHash() external view returns (bytes32);

  function setName(string calldata _name) external;
  function setSymbol(string calldata _symbol) external;
  function setDecimals(uint8 _decimals) external;
}
