/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


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

  function CrydrViewERC20(string _name, string _symbol, uint32 _decimals)
    CrydrViewBase('erc20')
    ERC20Named(_name, _symbol, _decimals) {}


  /* ERC20Interface */

  function transfer(address _to, uint _value) whenContractNotPaused returns (bool success) {
    // todo check gas consumption, do we need to optimise these type conversions ?
    CrydrControllerERC20Interface(address(crydrController)).transfer(msg.sender, _to, _value);
    return true;
  }

  function totalSupply() constant returns (uint) {
    // todo check gas consumption, do we need to optimise these type conversions ?
    return CrydrControllerERC20Interface(address(crydrController)).getTotalSupply();
  }

  function balanceOf(address _owner) constant returns (uint balance) {
    // todo check gas consumption, do we need to optimise these type conversions ?
    return CrydrControllerERC20Interface(address(crydrController)).getBalance(_owner);
  }


  function approve(address _spender, uint _value) whenContractNotPaused returns (bool success) {
    // todo check gas consumption, do we need to optimise these type conversions ?
    CrydrControllerERC20Interface(address(crydrController)).approve(msg.sender, _spender, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint _value) whenContractNotPaused returns (bool success) {
    // todo check gas consumption, do we need to optimise these type conversions ?
    CrydrControllerERC20Interface(address(crydrController)).transferFrom(msg.sender, _from, _to, _value);
    return true;
  }

  function allowance(address _owner, address _spender) constant returns (uint remaining) {
    // todo check gas consumption, do we need to optimise these type conversions ?
    return CrydrControllerERC20Interface(address(crydrController)).getAllowance(_owner, _spender);
  }


  /* CrydrViewERC20LoggableInterface */

  /* Actions */

  function emitTransferEvent(address _from, address _to, uint _value) whenContractNotPaused onlyCrydrController {
    Transfer(_from, _to, _value);
  }

  function emitApprovalEvent(address _owner, address _spender, uint _value) whenContractNotPaused onlyCrydrController {
    Approval(_owner, _spender, _value);
  }
}
