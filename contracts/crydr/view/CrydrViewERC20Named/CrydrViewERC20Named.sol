/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../../lifecycle/Manageable/ManageableInterface.sol';
import './CrydrViewERC20NamedInterface.sol';


contract CrydrViewERC20Named is ManageableInterface,
                                CrydrViewERC20NamedInterface {

  /* Storage */

  string tokenName = '';
  string tokenSymbol = '';
  uint8 tokenDecimals = 0;


  /* Constructor */

  constructor (string memory _name, string memory _symbol, uint8 _decimals) public {
    require(bytes(_name).length > 0);
    require(bytes(_symbol).length > 0);

    tokenName = _name;
    tokenSymbol = _symbol;
    tokenDecimals = _decimals;
  }


  /* CrydrViewERC20NamedInterface */

  function name() external view returns (string memory) {
    return tokenName;
  }

  function symbol() external view returns (string memory) {
    return tokenSymbol;
  }

  function decimals() external view returns (uint8) {
    return tokenDecimals;
  }


  function getNameHash() external view returns (bytes32){
    return keccak256(abi.encodePacked(tokenName));
  }

  function getSymbolHash() external view returns (bytes32){
    return keccak256(abi.encodePacked(tokenSymbol));
  }


  function setName(
    string calldata _name
  )
    external
    onlyAllowedManager('set_crydr_name')
  {
    require(bytes(_name).length > 0);

    tokenName = _name;
  }

  function setSymbol(
    string calldata _symbol
  )
    external
    onlyAllowedManager('set_crydr_symbol')
  {
    require(bytes(_symbol).length > 0);

    tokenSymbol = _symbol;
  }

  function setDecimals(
    uint8 _decimals
  )
    external
    onlyAllowedManager('set_crydr_decimals')
  {
    tokenDecimals = _decimals;
  }
}
