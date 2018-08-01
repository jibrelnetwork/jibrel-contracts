/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../lifecycle/PausableInterface.sol';
import './CrydrViewBaseInterface.sol';
import './CrydrViewERC20Interface.sol';

import '../controller/CrydrControllerERC20Interface.sol';


contract CrydrViewERC20 is PausableInterface,
                           CrydrViewBaseInterface,
                           CrydrViewERC20Interface {

  /* ERC20Interface */

  function transfer(
    address _to,
    uint256 _value
  )
    external
    whenContractNotPaused
    onlyPayloadSize(2 * 32)
    returns (bool)
  {
    CrydrControllerERC20Interface(getCrydrController()).transfer(msg.sender, _to, _value);
    return true;
  }

  function totalSupply() external constant returns (uint256) {
    return CrydrControllerERC20Interface(getCrydrController()).getTotalSupply();
  }

  function balanceOf(address _owner) external constant onlyPayloadSize(1 * 32) returns (uint256) {
    return CrydrControllerERC20Interface(getCrydrController()).getBalance(_owner);
  }


  function approve(
    address _spender,
    uint256 _value
  )
    external
    whenContractNotPaused
    onlyPayloadSize(2 * 32)
    returns (bool)
  {
    CrydrControllerERC20Interface(getCrydrController()).approve(msg.sender, _spender, _value);
    return true;
  }

  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  )
    external
    whenContractNotPaused
    onlyPayloadSize(3 * 32)
    returns (bool)
  {
    CrydrControllerERC20Interface(getCrydrController()).transferFrom(msg.sender, _from, _to, _value);
    return true;
  }

  function allowance(
    address _owner,
    address _spender
  )
    external
    constant
    onlyPayloadSize(2 * 32)
    returns (uint256)
  {
    return CrydrControllerERC20Interface(getCrydrController()).getAllowance(_owner, _spender);
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
