pragma solidity ^0.4.11;


/* Author: Victor Mezrin  victor@mezrin.com */


/**
 * @title NamedToken
 */
contract NamedToken {
  string public name;
  string public symbol;
  uint32 public decimals;

  function NamedToken(string _name, string _symbol, uint32 _decimals) {
    name = _name;
    symbol = _symbol;
    decimals = _decimals;
  }

  /**
   * @dev Function to calculate hash of the token`s name.
   * @dev Function needed because we can not just return name of the token to another contract - strings have variable length
   * @return Hash of the token`s name
   */
  function getNameHash() constant returns (bytes32 result){
    return sha3(name);
  }

  /**
   * @dev Function to calculate hash of the token`s symbol.
   * @dev Function needed because we can not just return symbol of the token to another contract - strings have variable length
   * @return Hash of the token`s symbol
   */
  function getSymbolHash() constant returns (bytes32 result){
    return sha3(symbol);
  }
}
