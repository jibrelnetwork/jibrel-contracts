/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../lifecycle/ManageableInterface.sol';
import './CrydrViewERC20NamedInterface.sol';


contract CrydrViewERC20Named is ManageableInterface,
                                CrydrViewERC20NamedInterface {

  /* Storage */

  string tokenName = '';
  string tokenSymbol = '';
  uint8 tokenDecimals = 0;


  /* Constructor */

  function CrydrViewERC20Named(string _name, string _symbol, uint8 _decimals) public {
    require(bytes(_name).length > 0);
    require(bytes(_symbol).length > 0);

    tokenName = _name;
    tokenSymbol = _symbol;
    tokenDecimals = _decimals;
  }


  /* CrydrViewERC20NamedInterface */

  function name() external constant returns (string) {
    return tokenName;
  }

  function symbol() external constant returns (string) {
    return tokenSymbol;
  }

  function decimals() external constant returns (uint8) {
    return tokenDecimals;
  }


  function getNameHash() external constant returns (bytes32){
    return keccak256(tokenName);
  }

  function getSymbolHash() external constant returns (bytes32){
    return keccak256(tokenSymbol);
  }


  function setName(string _name) external onlyAllowedManager('set_crydr_name') {
    require(bytes(_name).length > 0);

    tokenName = _name;
  }

  function setSymbol(string _symbol) external onlyAllowedManager('set_crydr_symbol') {
    require(bytes(_symbol).length > 0);

    tokenSymbol = _symbol;
  }

  function setDecimals(uint8 _decimals) external onlyAllowedManager('set_crydr_decimals') {
    tokenDecimals = _decimals;
  }
}
