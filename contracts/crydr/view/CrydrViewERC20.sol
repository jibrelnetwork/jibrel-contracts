/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import '../controller/CrydrControllerERC20Interface.sol';

import './CrydrViewBase.sol';
import './ERC20Interface.sol';
import './ERC20ConfigurableInterface.sol';
import './ERC20HashedInterface.sol';
import './ERC20LoggableInterface.sol';


contract CrydrViewERC20 is CrydrViewBase,
                           ERC20Interface,
                           ERC20ConfigurableInterface,
                           ERC20HashedInterface,
                           ERC20LoggableInterface {


  /* Storage */

  string tokenName = '';
  string tokenSymbol = '';
  uint8 tokenDecimals = 0;


  /* Constructor */

  function CrydrViewERC20(string _assetID, string _name, string _symbol, uint8 _decimals)
    CrydrViewBase(_assetID, 'erc20')
  {
    tokenName = _name;
    tokenSymbol = _symbol;
    tokenDecimals = _decimals;
  }


  /* ERC20Interface */

  function name() external constant returns (string) {
    return tokenName;
  }

  function symbol() external constant returns (string) {
    return tokenSymbol;
  }

  function decimals() external constant returns (uint8) {
    return tokenDecimals;
  }


  function transfer(
    address _to,
    uint _value
  )
    external
    whenContractNotPaused
    onlyPayloadSize(2 * 32)
    returns (bool)
  {
    CrydrControllerERC20Interface(crydrController).transfer(msg.sender, _to, _value);
    return true;
  }

  function totalSupply() external constant returns (uint) {
    return CrydrControllerERC20Interface(crydrController).getTotalSupply();
  }

  function balanceOf(address _owner) external constant onlyPayloadSize(1 * 32) returns (uint) {
    return CrydrControllerERC20Interface(crydrController).getBalance(_owner);
  }


  function approve(
    address _spender,
    uint _value
  )
    external
    whenContractNotPaused
    onlyPayloadSize(2 * 32)
    returns (bool)
  {
    CrydrControllerERC20Interface(crydrController).approve(msg.sender, _spender, _value);
    return true;
  }

  function transferFrom(
    address _from,
    address _to,
    uint _value
  )
    external
    whenContractNotPaused
    onlyPayloadSize(3 * 32)
    returns (bool)
  {
    CrydrControllerERC20Interface(crydrController).transferFrom(msg.sender, _from, _to, _value);
    return true;
  }

  function allowance(
    address _owner,
    address _spender
  )
    external
    constant
    onlyPayloadSize(2 * 32)
    returns (uint)
  {
    return CrydrControllerERC20Interface(crydrController).getAllowance(_owner, _spender);
  }


  /* ERC20ConfigurableInterface */

  function setName(string _name) external onlyAllowedManager('set_crydr_name') {
    tokenName = _name;
  }

  function setSymbol(string _symbol) external onlyAllowedManager('set_crydr_symbol') {
    tokenSymbol = _symbol;
  }

  function setDecimals(uint8 _decimals) external onlyAllowedManager('set_crydr_decimals') {
    tokenDecimals = _decimals;
  }


  /* ERC20HashedInterface */

  function getNameHash() external constant returns (bytes32){
    return sha3(tokenName);
  }

  function getSymbolHash() external constant returns (bytes32){
    return sha3(tokenSymbol);
  }


  /* ERC20LoggableInterface */

  function emitTransferEvent(
    address _from,
    address _to,
    uint _value
  )
    external
    whenContractNotPaused
    onlyCrydrController
  {
    Transfer(_from, _to, _value);
  }

  function emitApprovalEvent(
    address _owner,
    address _spender,
    uint _value
  )
    external
    whenContractNotPaused
    onlyCrydrController
  {
    Approval(_owner, _spender, _value);
  }


  /* Helpers */

  /**
   * @dev Fix for the ERC20 short address attack.
   */
  modifier onlyPayloadSize(uint256 size) {
    require(msg.data.length == (size + 4));
    _;
  }
}
