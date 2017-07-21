/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.11;


import '../controller/CrydrControllerERC20Interface.sol';
import '../controller/CrydrControllerERC20ValidatableInterface.sol';

import './CrydrViewBase.sol';
import './ERC20Named.sol';
import './ERC20Interface.sol';
import './CrydrViewERC20LoggableInterface.sol';
import './CrydrViewERC20ValidatableInterface.sol';


contract CrydrViewERC20 is CrydrViewBase,
                           ERC20Named,
                           ERC20Interface,
                           CrydrViewERC20LoggableInterface,
                           CrydrViewERC20ValidatableInterface {


  /* Constructor */

  function CrydrViewERC20(string _name, string _symbol, uint32 _decimals)
    CrydrViewBase('erc20')
    ERC20Named(_name, _symbol, _decimals) {}


  /* ERC20Interface */

//  function transfer(address _to, uint _value) whenNotPaused returns (bool success) {  // todo uncomment
  function transfer(address _to, uint _value) returns (bool success) {
    CrydrControllerERC20Interface(address(crydrController)).transfer(msg.sender, _to, _value);
    return true;
  }

  function totalSupply() constant returns (uint) {
    return crydrStorage.getTotalSupply();
  }

  function balanceOf(address _owner) constant returns (uint balance) {
    return crydrStorage.getBalance(_owner);
  }


  function approve(address _spender, uint _value) whenNotPaused returns (bool success) {
    CrydrControllerERC20Interface(address(crydrController)).approve(msg.sender, _spender, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint _value) whenNotPaused returns (bool success) {
    CrydrControllerERC20Interface(address(crydrController)).transferFrom(msg.sender, _from, _to, _value);
    return true;
  }

  function allowance(address _owner, address _spender) constant returns (uint remaining) {
    return crydrStorage.getAllowance(_owner, _spender);
  }


  /* CrydrViewERC20LoggableInterface */

  /* Actions */

  function emitTransferEvent(address _from, address _to, uint _value) onlyCrydrController {
    Transfer(_from, _to, _value);
  }

  function emitApprovalEvent(address _owner, address _spender, uint _value) onlyCrydrController {
    Approval(_owner, _spender, _value);
  }


  /* CrydrViewERC20ValidatableInterface */

  /* Getters */

  function isReceivingAllowed(address _account, uint _value) constant returns (bool) {
    var _controller = CrydrControllerERC20ValidatableInterface(address(crydrController));
    return _controller.isReceivingAllowed(_account, _value);
  }

  function isSpendingAllowed(address _account, uint _value) constant returns (bool) {
    var _controller = CrydrControllerERC20ValidatableInterface(address(crydrController));
    return _controller.isSpendingAllowed(_account, _value);
  }


  function isTransferAllowed(address _from, address _to, uint _value) constant returns (bool) {
    var _controller = CrydrControllerERC20ValidatableInterface(address(crydrController));
    return _controller.isTransferAllowed(_from, _to, _value);
  }


  function isApproveAllowed(address _from, address _spender, uint _value) constant returns (bool) {
    var _controller = CrydrControllerERC20ValidatableInterface(address(crydrController));
    return _controller.isApproveAllowed(_from, _spender, _value);
  }

  function isApprovedSpendingAllowed(address _from, address _spender, uint _value) constant returns (bool) {
    var _controller = CrydrControllerERC20ValidatableInterface(address(crydrController));
    return _controller.isApprovedSpendingAllowed(_from, _spender, _value);
  }

  function isTransferFromAllowed(address _spender, address _from, address _to, uint _value) constant returns (bool) {
    var _controller = CrydrControllerERC20ValidatableInterface(address(crydrController));
    return _controller.isTransferFromAllowed(_spender, _from, _to, _value);
  }
}
