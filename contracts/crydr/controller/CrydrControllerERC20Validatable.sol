/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../lifecycle/Pausable.sol";
import "../../registry/investor/InvestorRegistryInterface.sol";
import "./CrydrControllerERC20ValidatableInterface.sol";
import "../common/CrydrModifiers.sol";


contract CrydrControllerERC20Validatable is CrydrControllerERC20ValidatableInterface, Pausable, CrydrModifiers {

  /* Storage */

  InvestorRegistryInterface investorsRegistry;


  /* CrydrERC20ValidatableInterface */

  /* Configuration */

  function setInvestorsRegistry(
    address _investorsRegistry
  )
    onlyValidInvestorsRegistryAddress(_investorsRegistry)
    onlyAllowedManager('set_investors_registry')
    whenContractPaused
  {
    require(_investorsRegistry != address(investorsRegistry));

    investorsRegistry = InvestorRegistryInterface(_investorsRegistry);
    InvestorsRegistryChangedEvent(_investorsRegistry);
  }

  function getInvestorsRegistry() constant returns (address) {
    return address(investorsRegistry);
  }


  /* Pausable */

  /**
   * @dev Override method to ensure that contract properly configured before it is unpaused
   */
  function unpause()
    onlyValidInvestorsRegistryAddress(address(investorsRegistry))
  {
    super.unpauseContract();
  }


  /* Helpers */

  modifier onlyValidInvestorsRegistryAddress(address _viewAddress) {
    require(_viewAddress != address(0x0));
    require(isContract(_viewAddress) == true);
    _;
  }
}
