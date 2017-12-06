/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../controller/CrydrControllerBaseInterface.sol";
import "../view/ERC20Interface.sol";
import "./JNTPayableService.sol";
import "./JNTPayableServiceERC20Interface.sol";


contract JNTPayableServiceERC20 is JNTPayableService, JNTPayableServiceERC20Interface {

  /* Storage */

  uint256 jntPriceTransfer;
  uint256 jntPriceTransferFrom;
  uint256 jntPriceApprove;


  /* Constructor */

  function JNTPayableServiceERC20(uint256 _jntPriceTransfer, uint256 _jntPriceTransferFrom, uint256 _jntPriceApprove) {
    jntPriceTransfer = _jntPriceTransfer;
    jntPriceTransferFrom = _jntPriceTransferFrom;
    jntPriceApprove = _jntPriceApprove;
  }


  /* JNTPayableServiceERC20Interface */

  /* Configuration */

  function setJntPrice(
    uint256 _jntPriceTransfer, uint256 _jntPriceTransferFrom, uint256 _jntPriceApprove
  )
    onlyAllowedManager('set_jnt_price')
    whenContractPaused
  {
    require(_jntPriceTransfer != jntPriceTransfer ||
            _jntPriceTransferFrom != jntPriceTransferFrom ||
            _jntPriceApprove != jntPriceApprove);

    if (jntPriceTransfer != _jntPriceTransfer) {
      jntPriceTransfer = _jntPriceTransfer;
      JNTPriceTransferChangedEvent(_jntPriceTransfer);
    }
    if (jntPriceTransferFrom != _jntPriceTransferFrom) {
      jntPriceTransferFrom = _jntPriceTransferFrom;
      JNTPriceTransferFromChangedEvent(_jntPriceTransferFrom);
    }
    if (jntPriceApprove != _jntPriceApprove) {
      jntPriceApprove = _jntPriceApprove;
      JNTPriceApproveChangedEvent(_jntPriceApprove);
    }
  }

  function getJntPriceForTransfer() constant returns (uint256) {
    return jntPriceTransfer;
  }

  function getJntPriceForTransferFrom() constant returns (uint256) {
    return jntPriceTransferFrom;
  }

  function getJntPriceForApprove() constant returns (uint256) {
    return jntPriceApprove;
  }
}
