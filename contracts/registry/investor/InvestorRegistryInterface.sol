/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


/**
 * @title InvestorRegistryInterface
 * @dev Interface of the contract that stores licenses of the investors
 */
contract InvestorRegistryInterface {

  /* Events */

  event InvestorAdmittedEvent(address indexed investoraddress);
  event InvestorDeniedEvent(address indexed investoraddress);
  event InvestorLicenseGrantedEvent(address indexed investoraddress, string licensename, uint indexed expirationtimestamp);
  event InvestorLicenseRenewedEvent(address indexed investoraddress, string licensename, uint indexed expirationtimestamp);
  event InvestorLicenseRevokedEvent(address indexed investoraddress, string licensename);


  /* Getters */

  /**
   * @dev Function to check admittance of investor
   * @param _investor address Investor`s address
   * @return True if investor is in the registry and admitted
   */
  function isInvestorAdmitted(address _investor) constant returns (bool);

  /**
   * @dev Function to check licenses of investor
   * @param _investor    address Investor`s address
   * @param _licenseName string  License name
   * @return True if investor has been granted needed license (admittance not taken into account)
   */
  function isInvestorGranted(address _investor, string _licenseName) constant returns (bool);

  /**
   * @dev Function to check licenses of investor
   * @param _investor    address Investor`s address
   * @param _licenseName string  License name
   * @return True if investor is admitted and granted with needed license
   */
  function isInvestorAllowed(address _investor, string _licenseName) constant returns (bool);

  /**
   * @dev Function returns data about admittance of arbitrary investor
   * @dev Assumed that this function called only from the web interface via .call() notation, gas usage is huge :)
   * @dev Return value:
   * @dev   {"admittance": true, "licenses": [{"name": "..", "granted": true, "expiration": 1500295382}]}
   * @dev This method allows greatly reduce amount of calls from web UI to the blockchain
   * @dev IMPORTANT This is a kind of experiment and can be changed at any time
   * @param _investor address Investor`s address
   * @return JSON with all investor's licenses
   */
  function getInvestorAdmittance(address _investor) constant returns (string);
}
