/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


/**
 * @title JNTPayableService interface
 * @dev Interface of a contract that charge JNT for actions
 */
contract JNTPayableServiceInterface {

  /* Events */

  event JNTControllerChangedEvent(address jntcontroller);
  event JNTBeneficiaryChangedEvent(address jntbeneficiary);
  event JNTChargedEvent(address indexed from, address indexed to, uint256 value);


  /* Configuration */

  function setJntController(address _jntController) external;
  function getJntController() public constant returns (address);

  function setJntBeneficiary(address _jntBeneficiary) external;
  function getJntBeneficiary() public constant returns (address);


  /* Actions */

  function withdrawJnt() external;
}
