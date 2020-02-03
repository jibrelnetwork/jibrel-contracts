/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


/**
 * @title JNTPayableService interface
 * @dev Interface of a contract that charge JNT for actions
 */
contract JNTPayableServiceInterface {

  /* Events */

  event JNTControllerChangedEvent(address jntcontroller);
  event JNTBeneficiaryChangedEvent(address jntbeneficiary);
  event JNTChargedEvent(address indexed payer, address indexed to, uint256 value, bytes32 actionname);


  /* Configuration */

  function setJntController(address _jntController) external;
  function getJntController() public view returns (address);

  function setJntBeneficiary(address _jntBeneficiary) external;
  function getJntBeneficiary() public view returns (address);

  function setActionPrice(string calldata _actionName, uint256 _jntPriceWei) external;
  function getActionPrice(string memory _actionName) public view returns (uint256);


  /* Actions */

  function initChargeJNT(address _payer, string memory _actionName) internal;
}
