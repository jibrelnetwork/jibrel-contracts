/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "./InvestorRegistryInterface.sol";


/**
 * @title InvestorRegistryManagementInterface
 * @dev Interface of the contract that stores licenses of the investors and is configurable
 */
contract InvestorRegistryManagementInterface is InvestorRegistryInterface {

  /* Public functions */

  function admitInvestor(address _investor);
  function denyInvestor(address _investor);
  function grantInvestorLicense(address _investor, string _licenseName, uint _expireTimestamp);
  function renewInvestorLicense(address _investor, string _licenseName, uint _expireTimestamp);
  function revokeInvestorLicense(address _investor, string _licenseName);
}
