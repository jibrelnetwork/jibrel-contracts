/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


/**
 * @title CrydrControllerMintableInterface interface
 * @dev Interface of a contract that allows minting/burning of tokens
 */
contract CrydrControllerMintableInterface {

  /* Events */

  event MintEvent(address indexed owner, uint256 value);
  event BurnEvent(address indexed owner, uint256 value);

  /* minting/burning */

  function mint(address _account, uint256 _value) public;
  function burn(address _account, uint256 _value) public;
}
