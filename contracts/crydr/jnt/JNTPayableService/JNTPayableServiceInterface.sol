/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


/**
 * @title JNTPayableService interface
 * @dev Interface of a contract that charge JNT for actions
 */
contract JNTPayableServiceInterface {

  /* Events */

  event JNTControllerChangedEvent(address jntcontroller);
  event JNTBeneficiaryChangedEvent(address jntbeneficiary);
  event JNTChargedEvent(address indexed payer, address indexed to, uint256 value, string actionname);


  /* Configuration */

  function setJntController(address _jntController) external;
  function getJntController() public constant returns (address);

  function setJntBeneficiary(address _jntBeneficiary) external;
  function getJntBeneficiary() public constant returns (address);

  function setActionPrice(string _actionName, uint256 _jntPriceWei) external;
  function getActionPrice(string _actionName) public constant returns (uint256);


  /* Actions */

  function initChargeJNT(address _payer, string _actionName) internal;
}
