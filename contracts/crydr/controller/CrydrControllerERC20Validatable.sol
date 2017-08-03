/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


import "../../lifecycle/Pausable.sol";
import "../../registry/investor/InvestorRegistryInterface.sol";
import "./CrydrControllerERC20ValidatableManagerInterface.sol";


contract CrydrControllerERC20Validatable is CrydrControllerERC20ValidatableManagerInterface, Pausable {

  /* Storage */

  InvestorRegistryInterface investorsRegistry;


  /* CrydrControllerERC20ValidatableInterface */

  /* Configuration */

  function setInvestorsRegistry(
    address _investorsRegistry
  )
    onlyValidInvestorsRegistryAddress(_investorsRegistry)
    onlyAllowedManager('set_investors_registry')
    whenPaused
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
    onlyAllowedManager('unpause_contract')  // todo do we need to explicitly repeat modifiers ?
    whenPaused  // todo do we need to explicitly repeat modifiers ?
    onlyValidInvestorsRegistryAddress(address(investorsRegistry))
  {
    super.unpause();
  }


  /* Helpers */

  modifier onlyValidInvestorsRegistryAddress(address _viewAddress) {
    require(_viewAddress != address(0x0));
    // todo check that this is contract address
    _;
  }
}
