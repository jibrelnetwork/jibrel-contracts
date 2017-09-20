/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


import "../../contracts/crydr/controller/CrydrControllerERC20Interface.sol";
import "../../contracts/crydr/view/CrydrViewERC20LoggableInterface.sol";


/**
 * @title CrydrControllerERC20Mock
 * @dev This contract used only to test contracts
 */
contract CrydrControllerERC20Mock is CrydrControllerERC20Interface {

  /* Storage */

  uint public transferCounter = 0;
  uint public approveCounter = 0;
  uint public transferFromCounter = 0;
  address crydrView;

  function CrydrControllerERC20Mock(address _crydrView) {
    crydrView = _crydrView;
  }

  /* CrydrControllerERC20Interface */

  function transfer(address _msgsender, address _to, uint _value)
  {
    transferCounter += 1;
    CrydrViewERC20LoggableInterface(crydrView).emitTransferEvent(_msgsender, _to, _value);
  }

  function getTotalSupply() constant returns (uint)
  {
    return 60 * (10 ** 18);
  }

  function getBalance(address _owner) constant returns (uint balance)
  {
    return 40 * (10 ** 18);
  }

  function approve(address _msgsender, address _spender, uint _value)
  {
    approveCounter += 1;
    CrydrViewERC20LoggableInterface(crydrView).emitApprovalEvent(_msgsender, _spender, _value);
  }

  function transferFrom(address _msgsender, address _from, address _to, uint _value)
  {
    transferFromCounter += 1;
    CrydrViewERC20LoggableInterface(crydrView).emitTransferEvent(_from, _to, _value);
  }

  function getAllowance(address _owner, address _spender) constant returns (uint remaining)
  {
    return 20 * (10 ** 18);
  }
}
