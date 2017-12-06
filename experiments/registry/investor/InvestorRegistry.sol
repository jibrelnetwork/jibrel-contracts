/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../util/JsonEncoder.sol";
import "../../lifecycle/Manageable.sol";
import "./InvestorRegistryManagementInterface.sol";


/**
 * @title InvestorRegistry
 * @dev Contract that stores licenses of the investors
 */
contract InvestorRegistry is InvestorRegistryManagementInterface, Manageable, JsonEncoder {

  /* Storage */

  mapping (address => bool) investorAdmitted;
  mapping (address => mapping (string => bool)) investorLicenses;
  mapping (address => mapping (string => uint256)) investorLicensesExpiration;
  mapping (address => string[]) investorLicensesList;


  /* InvestorRegistryManagementInterface */

  function admitInvestor(
    address _investor
  )
    onlyValidInvestorAddress(_investor)
    onlyAllowedManager('admit_investor')
  {
    require(investorAdmitted[_investor] == false);

    investorAdmitted[_investor] = true;
    InvestorAdmittedEvent(_investor);
  }

  function denyInvestor(
    address _investor
  )
    onlyValidInvestorAddress(_investor)
    onlyAllowedManager('deny_investor')
  {
    require(investorAdmitted[_investor] == true);

    investorAdmitted[_investor] = false;
    InvestorDeniedEvent(_investor);
  }

  function grantInvestorLicense(
    address _investor, string _licenseName, uint256 _expireTimestamp
  )
    onlyValidInvestorAddress(_investor)
    onlyValidLicenseName(_licenseName)
    onlyAllowedManager('grant_license')
  {
    require(_expireTimestamp > now);
    require(investorLicenses[_investor][_licenseName] == false);

    investorLicenses[_investor][_licenseName] = true;
    investorLicensesExpiration[_investor][_licenseName] = _expireTimestamp;
    investorLicensesList[_investor].push(_licenseName);

    InvestorLicenseGrantedEvent(_investor, _licenseName, _expireTimestamp);
  }

  function renewInvestorLicense(
    address _investor, string _licenseName, uint256 _expireTimestamp
  )
    onlyValidInvestorAddress(_investor)
    onlyValidLicenseName(_licenseName)
    onlyAllowedManager('renew_license')
  {
    require(_expireTimestamp > now);
    require(investorLicenses[_investor][_licenseName] == true);

    investorLicensesExpiration[_investor][_licenseName] = _expireTimestamp;
    InvestorLicenseRenewedEvent(_investor, _licenseName, _expireTimestamp);
  }

  function revokeInvestorLicense(
    address _investor, string _licenseName
  )
    onlyValidInvestorAddress(_investor)
    onlyValidLicenseName(_licenseName)
    onlyAllowedManager('revoke_license')
  {
    require(investorLicenses[_investor][_licenseName] == true);

    investorLicenses[_investor][_licenseName] = false;
    InvestorLicenseRevokedEvent(_investor, _licenseName);
  }


  /* InvestorRegistryInterface */

  function isInvestorAdmitted(
    address _investor
  )
    onlyValidInvestorAddress(_investor)
    constant
    returns (bool result)
  {
    return investorAdmitted[_investor];
  }

  function isInvestorGranted(
    address _investor, string _licenseName
  )
    onlyValidInvestorAddress(_investor)
    onlyValidLicenseName(_licenseName)
    constant
    returns (bool result)
  {
    return investorLicenses[_investor][_licenseName] &&
           (investorLicensesExpiration[_investor][_licenseName] > now);
  }

  function isInvestorAllowed(
    address _investor, string _licenseName
  )
    onlyValidInvestorAddress(_investor)
    onlyValidLicenseName(_licenseName)
    constant
    returns (bool result)
  {
    return investorAdmitted[_investor] &&
           investorLicenses[_investor][_licenseName] &&
           (investorLicensesExpiration[_investor][_licenseName] > now);
  }

  function getInvestorAdmittance(address _investor) public constant returns (string) {
    strings.slice[] memory jsonSlices = new strings.slice[](investorLicensesList[_investor].length * 2 - 1 + 4);
    jsonSlices[0] = '{"admittance": '.toSlice();
    jsonSlices[1] = boolToAsciiString(investorAdmitted[_investor]).toSlice();
    jsonSlices[2] = ', "licenses": ['.toSlice();
    for (uint256 i = 0; i < investorLicensesList[_investor].length; i++) {
      jsonSlices[i * 2 + 3] = encodeLicenseInfo(_investor, investorLicensesList[_investor][i]).toSlice();
      jsonSlices[i * 2 + 4] = ','.toSlice();
    }
    jsonSlices[investorLicensesList[_investor].length + 3] = ']}'.toSlice();

    return "".toSlice().join(jsonSlices);
  }


  /* JSON methods */

  function encodeLicenseInfo(address _investor, string _licenseName) internal constant returns (string) {
    string[7] memory jsonParts = [
      '{"name": "',
      _licenseName,
      '", "granted": ',
      boolToAsciiString(investorLicenses[_investor][_licenseName]),
      ', "expiration": ',
      uintToAsciiString(investorLicensesExpiration[_investor][_licenseName]),
      '}'
    ];

    strings.slice[] memory jsonSlices = new strings.slice[](jsonParts.length);
    for (uint256 i = 0; i < jsonParts.length; i += 1) {
      jsonSlices[i] = jsonParts[i].toSlice();
    }
    return "".toSlice().join(jsonSlices);
  }


  /* Helpers */

  modifier onlyValidInvestorAddress(address _investor) {
    require(_investor != address(0x0));
    _;
  }

  modifier onlyValidLicenseName(string _licenseName) {
    require(bytes(_licenseName).length != 0);
    _;
  }
}
