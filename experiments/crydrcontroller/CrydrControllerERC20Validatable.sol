/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../lifecycle/PausableInterface.sol';
import '../../util/CommonModifiersInterface.sol';
import '../../registry/investor/InvestorRegistryInterface.sol';
import './CrydrControllerERC20ValidatableInterface.sol';


contract CrydrControllerERC20Validatable is CommonModifiersInterface,
                                            PausableInterface,
                                            CrydrControllerERC20ValidatableInterface {

  /* Storage */

  InvestorRegistryInterface investorsRegistry;


  /* CrydrERC20ValidatableInterface */

  /* Configuration */

  function setInvestorsRegistry(
    address _investorsRegistry
  )
    onlyContractAddress(_investorsRegistry)
    onlyAllowedManager('set_investors_registry')
    whenContractPaused
  {
    require(_investorsRegistry != address(investorsRegistry));

    investorsRegistry = InvestorRegistryInterface(_investorsRegistry);
    InvestorsRegistryChangedEvent(_investorsRegistry);
  }

  function getInvestorsRegistry() public constant returns (address) {
    return address(investorsRegistry);
  }


  /* Pausable */

  /**
   * @dev Override method to ensure that contract properly configured before it is unpaused
   */
  function unpauseContract()
    public
    onlyContractAddress(address(investorsRegistry))
  {
    super.unpauseContract();
  }
}
