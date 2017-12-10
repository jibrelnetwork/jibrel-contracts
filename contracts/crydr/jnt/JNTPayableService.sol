/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


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
    JNTControllerChangedEvent(_jntController);
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

    jntBeneficiary = _jntBeneficiary;
    JNTBeneficiaryChangedEvent(jntBeneficiary);
  }

  function getJntBeneficiary() public constant returns (address) {
    return jntBeneficiary;
  }


  /* Actions */

  function chargeJNTForService(address _from, address _to, uint256 _value) internal whenContractNotPaused {
    require(_from != address(0x0));
    require(_to != address(0x0));
    require(_from != _to);
    require(_value > 0);

    jntController.chargeJNT(_from, _to, _value);
    JNTChargedEvent(_from, _to, _value);
  }

  /**
   * @dev Method used to withdraw collected JNT if contract itself used to store charged JNT.
   * @dev Assumed that JNT provides 'erc20' view.
   */
  function withdrawJnt()
    external
    onlyAllowedManager('withdraw_jnt')
    onlyValidJntBeneficiary(jntBeneficiary)
  {
    var _jntControllerAddress = address(jntController);
    var _crydrController = CrydrControllerBaseInterface(_jntControllerAddress);
    var _jntERC20ViewAddress = _crydrController.getCrydrViewAddress('erc20');
    var _jntERC20View = CrydrViewERC20Interface(_jntERC20ViewAddress);
    _jntERC20View.transfer(jntBeneficiary, _jntERC20View.balanceOf(this));
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
