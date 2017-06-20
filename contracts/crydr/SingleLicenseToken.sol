pragma solidity ^0.4.11;


/* Author: Victor Mezrin  victor@mezrin.com */


import "../solidity-stringutils/strings.sol";
import "../investor/InvestorRepository.sol";
import "../token/LicensedToken.sol";


/**
 * @title SingleLicenseToken
 */
contract SingleLicenseToken is LicensedToken {

  /* Libs */

  using strings for *;


  /* Storage */

  string licenseName;
  InvestorRepository investorsRepository;


  /* Constructor */

  function SingleLicenseToken(address _investorsRepository, string _licenseName) {
    if (_investorsRepository == 0x0 || bytes(_licenseName).length == 0) {
      throw;
    }
    investorsRepository = InvestorRepository(_investorsRepository);
    licenseName = _licenseName;
  }


  /* Getters */

  /**
   * @dev Function to get name of the required license.
   * @return Name of the license
   */
  function getLicenseName() constant returns (string) {
    return licenseName;
  }

  /**
   * @dev Function to get address of the repository with investor`s permissions
   * @return Address of the repository with investor`s permissions
   */
  function getInvestorsRepositoryAddress() constant returns (address) {
    return investorsRepository;
  }


  /* Checking of licenses */

  function isSpendingAllowed(address _from, address _to, uint _value) constant returns (bool result) {
    return investorsRepository.isInvestorGranted(_to, licenseName);
  }

  function isApprovalAllowed(address _from, address _spender, uint _value) constant returns (bool result) {
    return true;
  }

  function getLicenseInfo() constant returns (string result) {
    result = '{ "license_needed": true, "single_license": "';
    result = concat(result, licenseName);
    result = concat(result, '" }');
  }

  function concat(string s1, string s2) internal returns (string){
    return s1.toSlice().concat(s2.toSlice());
  }
}
