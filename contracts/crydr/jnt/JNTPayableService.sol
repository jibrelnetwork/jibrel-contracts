/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../util/CommonModifiersInterface.sol';
import '../../lifecycle/ManageableInterface.sol';
import '../../lifecycle/PausableInterface.sol';
import './JNTPayableServiceInterface.sol';

import '../view/CrydrViewERC20Interface.sol';
import '../controller/CrydrControllerBaseInterface.sol';
import '../jnt/JNTControllerInterface.sol';


contract JNTPayableService is CommonModifiersInterface,
                              ManageableInterface,
                              PausableInterface,
                              JNTPayableServiceInterface {

  /* Storage */

  JNTControllerInterface jntController;
  address jntBeneficiary;


  /* JNTPayableServiceInterface */

  /* Configuration */

  function setJntController(
    address _jntController
  )
    external
    onlyContractAddress(_jntController)
    onlyAllowedManager('set_jnt_controller')
    whenContractPaused
  {
    require(_jntController != address(jntController));

    jntController = JNTControllerInterface(_jntController);

    emit JNTControllerChangedEvent(_jntController);
  }

  function getJntController() public constant returns (address) {
    return address(jntController);
  }


  function setJntBeneficiary(
    address _jntBeneficiary
  )
    external
    onlyValidJntBeneficiary(_jntBeneficiary)
    onlyAllowedManager('set_jnt_beneficiary')
    whenContractPaused
  {
    require(_jntBeneficiary != jntBeneficiary);
    require(_jntBeneficiary != address(this));

    jntBeneficiary = _jntBeneficiary;

    emit JNTBeneficiaryChangedEvent(jntBeneficiary);
  }

  function getJntBeneficiary() public constant returns (address) {
    return jntBeneficiary;
  }


  /* Actions */

  function chargeJNTForService(address _from, uint256 _value) internal whenContractNotPaused {
    require(_from != address(0x0));
    require(_from != jntBeneficiary);
    require(_value > 0);

    jntController.chargeJNT(_from, jntBeneficiary, _value);

    emit JNTChargedEvent(_from, jntBeneficiary, _value);
  }


  /* Pausable */

  /**
   * @dev Override method to ensure that contract properly configured before it is unpaused
   */
  function unpauseContract()
    public
    onlyContractAddress(jntController)
    onlyValidJntBeneficiary(jntBeneficiary)
  {
    super.unpauseContract();
  }


  /* Helpers */

  modifier onlyValidJntBeneficiary(address _jntBeneficiary) {
    require(_jntBeneficiary != address(0x0));
    _;
  }
}
