/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


/**
 * @title JNTPayableService interface
 * @dev Interface of a contract that charge JNT for actions
 */
contract JNTPayableServiceInterface {

  /* Events */

  event JNTControllerChangedEvent(address jntcontroller);
  event JNTBeneficiaryChangedEvent(address jntbeneficiary);
  event JNTChargedEvent(address indexed from, address indexed to, uint value);


  /* Configuration */

  function setJntController(address _jntController) external;
  function getJntController() external constant returns (address);

  function setJntBeneficiary(address _jntBeneficiary) external;
  function getJntBeneficiary() external constant returns (address);


  /* Actions */

  function withdrawJnt() external;
}
