/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../../util/CommonModifiers/CommonModifiersInterface.sol';
import '../../../lifecycle/Manageable/ManageableInterface.sol';
import '../../../lifecycle/Pausable/PausableInterface.sol';
import './JNTPayableServiceInterface.sol';

import '../../view/CrydrViewERC20/CrydrViewERC20Interface.sol';
import '../../controller/CrydrControllerBase/CrydrControllerBaseInterface.sol';
import '../JNTControllerInterface/JNTControllerInterface.sol';


contract JNTPayableService is CommonModifiersInterface,
                              ManageableInterface,
                              PausableInterface,
                              JNTPayableServiceInterface {

  /* Storage */

  JNTControllerInterface jntController;
  address jntBeneficiary;
  mapping (string => uint256) actionPrice;


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


  function setActionPrice(
    string _actionName,
    uint256 _jntPriceWei
  )
    external
    onlyAllowedManager('set_action_price')
    onlyValidActionName(_actionName)
    whenContractPaused
  {
    require (_jntPriceWei > 0);

    actionPrice[_actionName] = _jntPriceWei;
  }

  function getActionPrice(
    string _actionName
  )
    public
    constant
    onlyValidActionName(_actionName)
    returns (uint256)
  {
    return actionPrice[_actionName];
  }


  /* Actions */

  function initChargeJNT(
    address _from,
    string _actionName
  )
    internal
    onlyValidActionName(_actionName)
    whenContractNotPaused
  {
    require(_from != address(0x0));
    require(_from != jntBeneficiary);

    uint256 _actionPrice = getActionPrice(_actionName);
    require (_actionPrice > 0);

    jntController.chargeJNT(_from, jntBeneficiary, _actionPrice);

    emit JNTChargedEvent(_from, jntBeneficiary, _actionPrice, _actionName);
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


  /* Modifiers */

  modifier onlyValidJntBeneficiary(address _jntBeneficiary) {
    require(_jntBeneficiary != address(0x0));
    _;
  }

  /**
   * @dev Modifier to check name of manager permission
   */
  modifier onlyValidActionName(string _actionName) {
    require(bytes(_actionName).length != 0);
    _;
  }
}
