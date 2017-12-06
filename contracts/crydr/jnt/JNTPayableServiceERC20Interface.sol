/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


/**
 * @title JNTPayableServiceERC20 interface
 * @dev Interface of a CryDR controller that charge JNT for actions
 * @dev Price for actions has a flat value and do not depend on amount of transferred CryDRs
 */
contract JNTPayableServiceERC20Interface {

  /* Events */

  event JNTPriceTransferChangedEvent(uint256 value);
  event JNTPriceTransferFromChangedEvent(uint256 value);
  event JNTPriceApproveChangedEvent(uint256 value);


  /* Configuration */

  function setJntPrice(uint256 _jntPriceTransfer, uint256 _jntPriceTransferFrom, uint256 _jntPriceApprove) external;
  function getJntPriceForTransfer() public constant returns (uint256);
  function getJntPriceForTransferFrom() public constant returns (uint256);
  function getJntPriceForApprove() public constant returns (uint256);
}
