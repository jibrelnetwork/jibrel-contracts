/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


/**
 * @title JNTPayableServiceERC20 interface
 * @dev Interface of a CryDR controller that charge JNT for actions
 * @dev Price for actions has a flat value and do not depend on amount of transferred CryDRs
 */
contract JNTPayableServiceERC20Interface {

  /* Events */

  event JNTPriceTransferChangedEvent(uint value);
  event JNTPriceTransferFromChangedEvent(uint value);
  event JNTPriceApproveChangedEvent(uint value);


  /* Configuration */

  function setJntPrice(uint _jntPriceTransfer, uint _jntPriceTransferFrom, uint _jntPriceApprove) external;
  function getJntPriceForTransfer() external constant returns (uint);
  function getJntPriceForTransferFrom() external constant returns (uint);
  function getJntPriceForApprove() external constant returns (uint);
}
