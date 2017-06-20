pragma solidity ^0.4.11;


/* Author: Victor Mezrin  victor@mezrin.com */


import "../utils/Manageable.sol";


/**
 * @title InvestorRepositoryInterface
 * @dev Interface of the contract that stores licenses of the investors
 */
contract InvestorRepositoryInterface {

  /* Public functions */

  /**
   * @dev Function to check presence of the investor
   * @param _investor address Investor`s address
   * @return True if investor is in the repository and activated
   */
  function isInvestorAdmitted(address _investor) constant returns (bool result);

  /**
   * @dev Function to check licenses of the investor
   * @param _investor                address Investor`s address
   * @param _requiredInvestorLicense string  License name
   * @return True if investor has been granted needed license.
   */
  function isInvestorGranted(address _investor, string _requiredInvestorLicense) constant returns (bool result);


  /* Events */

  event InvestorEnabledEvent(address indexed investor);
  event InvestorDisabledEvent(address indexed investor);
  event InvestorLicenseGrantedEvent(address indexed investor, string indexed license);
  event InvestorLicenseCancelledEvent(address indexed investor, string indexed license);
}


/**
 * @title InvestorRepository
 * @dev Contract that stores licenses of the investors
 */
contract InvestorRepository is InvestorRepositoryInterface, Manageable {
  mapping (address => bool) investorEnabled;
  mapping (address => mapping (string => bool)) investorLicenses;

  /**
   * @dev Function to enable investor
   * @param _investor address New investor
   */
  function admitInvestor(address _investor) onlyManager('enable_investor') {
    if (investorEnabled[_investor]) {
      return;
    }
    investorEnabled[_investor] = true;
    InvestorEnabledEvent(_investor);
  }

  /**
   * @dev Function to disable existing investor
   * @param _investor address Existing investor
   */
  function denyInvestor(address _investor) onlyManager('disable_investor') {
    if (investorEnabled[_investor] == false) {
      return;
    }
    investorEnabled[_investor] = false;
    InvestorDisabledEvent(_investor);
  }

  /**
   * @dev Function to grant new license to the existing investor
   * @param _investor        address Existing investor
   * @param _investorLicense string  Granted license
   */
  function grantInvestorLicense(address _investor, string _investorLicense) onlyManager('grant_license') {
    if (bytes(_investorLicense).length == 0) {
      throw;
    }
    if (investorLicenses[_investor][_investorLicense]) {
      return;
    }
    investorLicenses[_investor][_investorLicense] = true;
    InvestorLicenseGrantedEvent(_investor, _investorLicense);
  }

  /**
   * @dev Function to cancel license of the existing investor
   * @param _investor        address Existing investor
   * @param _investorLicense string  Cancelled license
   */
  function cancelInvestorLicense(address _investor, string _investorLicense) onlyManager('cancel_license') {
    if (bytes(_investorLicense).length == 0) {
      throw;
    }
    if (investorLicenses[_investor][_investorLicense] == false) {
      return;
    }
    investorLicenses[_investor][_investorLicense] = false;
    InvestorLicenseCancelledEvent(_investor, _investorLicense);
  }

  function isInvestorAdmitted(address _investor) constant returns (bool result) {
    if (_investor == 0x0) {
      return false;
    }
    return investorEnabled[_investor];
  }

  function isInvestorGranted(address _investor, string _requiredInvestorLicense) constant returns (bool result) {
    if (isInvestorAdmitted(_investor) == false) {
      return false;
    }
    if (bytes(_requiredInvestorLicense).length == 0) {
      return false;
    }
    if (investorLicenses[_investor][_requiredInvestorLicense] == false) {
      return false;
    }
    return true;
  }
}
