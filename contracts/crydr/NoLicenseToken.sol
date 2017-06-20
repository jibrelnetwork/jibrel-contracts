pragma solidity ^0.4.11;


/* Author: Victor Mezrin  victor@mezrin.com */


import "../token/LicensedToken.sol";


/**
 * @title NoLicenseToken
 */
contract NoLicenseToken is LicensedToken {

  /* Checking of licenses */

  function isSpendingAllowed(address _from, address _to, uint _value) constant returns (bool result) {
    return true;
  }

  function isApprovalAllowed(address _from, address _spender, uint _value) constant returns (bool result) {
    return true;
  }

  function getLicenseInfo() constant returns (string result) {
    result = '{ "license_needed": false }';
  }
}
