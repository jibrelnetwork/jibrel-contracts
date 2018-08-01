/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../controller/CrydrControllerERC20Interface.sol';

import './CrydrViewBase.sol';
import './ERC20Named.sol';
import '../common/CrydrERC20ValidatableInterface.sol';


contract CrydrViewERC20Validatable is CrydrViewBase,
                                      ERC20Named,
                                      CrydrERC20ValidatableInterface {


  /* Constructor */

  function CrydrViewERC20Validatable(string _name, string _symbol, uint8 _decimals)
    CrydrViewBase('erc20__validatable', 0xffffffff)
    ERC20Named(_name, _symbol, _decimals) {}


  /* CrydrERC20ValidatableInterface */

  function isReceivingAllowed(address _account, uint256 _value) public constant returns (bool) {
    var _controller = CrydrERC20ValidatableInterface(address(crydrController));
    return _controller.isReceivingAllowed(_account, _value);
  }

  function isSpendingAllowed(address _account, uint256 _value) public constant returns (bool) {
    var _controller = CrydrERC20ValidatableInterface(address(crydrController));
    return _controller.isSpendingAllowed(_account, _value);
  }


  function isTransferAllowed(address _from, address _to, uint256 _value) public constant returns (bool) {
    var _controller = CrydrERC20ValidatableInterface(address(crydrController));
    return _controller.isTransferAllowed(_from, _to, _value);
  }


  function isApproveAllowed(address _from, address _spender, uint256 _value) public constant returns (bool) {
    var _controller = CrydrERC20ValidatableInterface(address(crydrController));
    return _controller.isApproveAllowed(_from, _spender, _value);
  }

  function isApprovedSpendingAllowed(address _from, address _spender, uint256 _value) public constant returns (bool) {
    var _controller = CrydrERC20ValidatableInterface(address(crydrController));
    return _controller.isApprovedSpendingAllowed(_from, _spender, _value);
  }

  function isTransferFromAllowed(address _spender, address _from, address _to, uint256 _value) public constant returns (bool) {
    var _controller = CrydrERC20ValidatableInterface(address(crydrController));
    return _controller.isTransferFromAllowed(_spender, _from, _to, _value);
  }
}
