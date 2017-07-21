/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.11;


import "../controller/CrydrControllerBaseInterface.sol";
import "../view/ERC20Interface.sol";
import "./JNTPayableService.sol";
import "./JNTPayableServiceERC20Interface.sol";


contract JNTPayableServiceERC20 is JNTPayableService, JNTPayableServiceERC20Interface {

  /* Storage */

  uint jntPriceTransfer;
  uint jntPriceTransferFrom;
  uint jntPriceApprove;


  /* JNTPayableServiceERC20Interface */

  /* Configuration */

  function setJntPrice(
    uint _jntPriceTransfer, uint _jntPriceTransferFrom, uint _jntPriceApprove
  )
    onlyAllowedManager('set_jnt_price')
    whenPaused
  {
    if (jntPriceTransfer != _jntPriceTransfer) {
      jntPriceTransfer = _jntPriceTransfer;
      JNTPriceTransferChangedEvent(_jntPriceTransfer);
    }
    if (jntPriceTransferFrom != _jntPriceTransferFrom) {
      jntPriceTransferFrom = _jntPriceTransferFrom;
      JNTPriceTransferChangedEvent(_jntPriceTransferFrom);
    }
    if (jntPriceApprove != _jntPriceApprove) {
      jntPriceApprove = _jntPriceApprove;
      JNTPriceApproveChangedEvent(_jntPriceApprove);
    }
  }

  function getJntPriceForTransfer() constant returns (uint) {
    return jntPriceTransfer;
  }

  function getJntPriceForTransferFrom() constant returns (uint) {
    return jntPriceTransferFrom;
  }

  function getJntPriceForApprove() constant returns (uint) {
    return jntPriceApprove;
  }
}
