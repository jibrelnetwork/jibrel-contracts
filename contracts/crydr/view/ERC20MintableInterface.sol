/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


/**
 * @title ERC20MintableInterface
 * @dev Contract is able to create Mint/Burn events with the cal from controller
 */
contract ERC20MintableInterface {
  event MintEvent(address indexed owner, uint256 value);
  event BurnEvent(address indexed owner, uint256 value);

  function emitMintEvent(address _owner, uint256 _value) external;
  function emitBurnEvent(address _owner, uint256 _value) external;
}
