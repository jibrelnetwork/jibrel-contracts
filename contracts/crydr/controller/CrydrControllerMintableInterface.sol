/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


/**
 * @title CrydrControllerMintableInterface interface
 * @dev Interface of a contract that allows minting/burning of tokens
 */
contract CrydrControllerMintableInterface {

  /* minting/burning */

  // todo views should know about Mint/Burn events

  function mint(address _account, uint256 _value);
  function burn(address _account, uint256 _value);
}
