/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import '../controller/CrydrControllerERC20Interface.sol';

import './CrydrViewBase.sol';
import './ERC20Named.sol';
import './ERC20Interface.sol';
import './CrydrViewERC20LoggableInterface.sol';


contract CrydrViewERC20 is CrydrViewBase,
                           ERC20Named,
                           ERC20Interface,
                           CrydrViewERC20LoggableInterface {


  /* Constructor */

  function CrydrViewERC20(string _assetID, string _name, string _symbol, uint8 _decimals)
    CrydrViewBase(_assetID, 'erc20')
    ERC20Named(_name, _symbol, _decimals) {}


  /* ERC20Interface */

  function transfer(
    address _to,
    uint _value
  )
    external
    whenContractNotPaused
    onlyPayloadSize(2 * 32)
    returns (bool success)
  {
    CrydrControllerERC20Interface(crydrController).transfer(msg.sender, _to, _value);
    return true;
  }

  function totalSupply() external constant returns (uint) {
    return CrydrControllerERC20Interface(crydrController).getTotalSupply();
  }

  function balanceOf(address _owner) external constant onlyPayloadSize(1 * 32) returns (uint balance) {
    return CrydrControllerERC20Interface(crydrController).getBalance(_owner);
  }


  function approve(
    address _spender,
    uint _value
  )
    external
    whenContractNotPaused
    onlyPayloadSize(2 * 32)
    returns (bool success)
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
    returns (bool success)
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
    returns (uint remaining)
  {
    return CrydrControllerERC20Interface(crydrController).getAllowance(_owner, _spender);
  }


  /* CrydrViewERC20LoggableInterface */

  /* Actions */

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
    assert(msg.data.length == (size + 4));
    _;
  }
}
