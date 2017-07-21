/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.11;


import './ERC20NamedInterface.sol';


contract ERC20Named is ERC20NamedInterface {

  /* Storage */

  string tokenName;
  string tokenSymbol;
  uint32 tokenDecimals;


  /* Storage */

  function ERC20Named(string _name, string _symbol, uint32 _decimals) {
    tokenName = _name;
    tokenSymbol = _symbol;
    tokenDecimals = _decimals;
  }


  /* Getters */

  function name() constant returns (string) {
    return tokenName;
  }

  function symbol() constant returns (string) {
    return tokenSymbol;
  }

  function decimals() constant returns (uint32) {
    return tokenDecimals;
  }

  /**
   * @dev Function to calculate hash of the token`s name.
   * @dev Function needed because we can not just return name of the token to another contract
   * @dev because strings can not be passed between contracts
   * @return Hash of the token`s name
   */
  function getNameHash() constant returns (bytes32 result){
    return sha3(tokenName);
  }

  /**
   * @dev Function to calculate hash of the token`s symbol.
   * @dev Function needed because we can not just return symbol of the token to another contract
   * @dev because strings can not be passed between contracts
   * @return Hash of the token`s symbol
   */
  function getSymbolHash() constant returns (bytes32 result){
    return sha3(tokenSymbol);
  }
}

