/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../lifecycle/ManageableInterface.sol';
import '../../lifecycle/PausableInterface.sol';
import './JNTPayableServiceERC20FeesInterface.sol';


contract JNTPayableServiceERC20Fees is ManageableInterface,
                                       PausableInterface,
                                       JNTPayableServiceERC20FeesInterface {

  /* Storage */

  uint256 jntPriceTransfer;
  uint256 jntPriceTransferFrom;
  uint256 jntPriceApprove;


  /* Constructor */

  constructor (
    uint256 _jntPriceTransfer,
    uint256 _jntPriceTransferFrom,
    uint256 _jntPriceApprove
  )
    public
  {
    jntPriceTransfer = _jntPriceTransfer;
    jntPriceTransferFrom = _jntPriceTransferFrom;
    jntPriceApprove = _jntPriceApprove;
  }


  /* JNTPayableServiceERC20FeesInterface */

  /* Configuration */

  function setJntPrice(
    uint256 _jntPriceTransfer, uint256 _jntPriceTransferFrom, uint256 _jntPriceApprove
  )
    external
    onlyAllowedManager('set_jnt_price')
    whenContractPaused
  {
    require(_jntPriceTransfer != jntPriceTransfer ||
            _jntPriceTransferFrom != jntPriceTransferFrom ||
            _jntPriceApprove != jntPriceApprove);

    if (jntPriceTransfer != _jntPriceTransfer) {
      jntPriceTransfer = _jntPriceTransfer;
      emit JNTPriceTransferChangedEvent(_jntPriceTransfer);
    }
    if (jntPriceTransferFrom != _jntPriceTransferFrom) {
      jntPriceTransferFrom = _jntPriceTransferFrom;
      emit JNTPriceTransferFromChangedEvent(_jntPriceTransferFrom);
    }
    if (jntPriceApprove != _jntPriceApprove) {
      jntPriceApprove = _jntPriceApprove;
      emit JNTPriceApproveChangedEvent(_jntPriceApprove);
    }
  }

  function getJntPriceForTransfer() public constant returns (uint256) {
    return jntPriceTransfer;
  }

  function getJntPriceForTransferFrom() public constant returns (uint256) {
    return jntPriceTransferFrom;
  }

  function getJntPriceForApprove() public constant returns (uint256) {
    return jntPriceApprove;
  }
}
