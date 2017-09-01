/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


import "../common/CrydrERC20ValidatableInterface.sol";


/**
 * @title CrydrControllerERC20ValidatableManagerInterface interface
 * @dev Interface of a contract that allows to check validity of transaction (in terms of licensing only)
 */
contract CrydrControllerERC20ValidatableInterface is CrydrERC20ValidatableInterface {

  /* Events */

  event InvestorsRegistryChangedEvent(address indexed investorsrepository);


  /* Configuration */

  function setInvestorsRegistry(address _investorsRegistry) external;
  function getInvestorsRegistry() external constant returns (address);
}
