/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import "../../lifecycle/Manageable.sol";
import "./CrydrLicenseRegistryInterface.sol";
import "./CrydrLicenseRegistryManagementInterface.sol";


/**
 * @title CrydrLicenseRegistry
 * @dev Contract that stores licenses
 */
contract CrydrLicenseRegistry is ManageableInterface,
                                 CrydrLicenseRegistryInterface,
                                 CrydrLicenseRegistryManagementInterface {

  /* Storage */

  mapping (address => bool) userAdmittance;
  mapping (address => mapping (string => bool)) userLicenses;
  mapping (address => mapping (string => uint256)) userLicensesExpiration;


  /* CrydrLicenseRegistryManagementInterface */

  function admitUser(
    address _userAddress
  )
    external
    onlyValidAddress(_userAddress)
    onlyAllowedManager('admit_user')
  {
    require(userAdmittance[_userAddress] == false);

    userAdmittance[_userAddress] = true;
    UserAdmittedEvent(_userAddress);
  }

  function denyUser(
    address _userAddress
  )
    external
    onlyValidAddress(_userAddress)
    onlyAllowedManager('deny_user')
  {
    require(userAdmittance[_userAddress] == true);

    userAdmittance[_userAddress] = false;
    UserDeniedEvent(_userAddress);
  }

  function grantUserLicense(
    address _userAddress, string _licenseName, uint256 _expirationTimestamp
  )
    external
    onlyValidAddress(_userAddress)
    onlyValidLicenseName(_licenseName)
    onlyAllowedManager('grant_license')
  {
    require(_expirationTimestamp > now);
    require(userLicenses[_userAddress][_licenseName] == false);

    userLicenses[_userAddress][_licenseName] = true;
    userLicensesExpiration[_userAddress][_licenseName] = _expirationTimestamp;

    UserLicenseGrantedEvent(_userAddress, _licenseName, _expirationTimestamp);
  }

  function renewUserLicense(
    address _userAddress, string _licenseName, uint256 _expirationTimestamp
  )
    external
    onlyValidAddress(_userAddress)
    onlyValidLicenseName(_licenseName)
    onlyAllowedManager('renew_license')
  {
    require(_expirationTimestamp > now);
    require(userLicenses[_userAddress][_licenseName] == true);

    userLicensesExpiration[_userAddress][_licenseName] = _expirationTimestamp;

    UserLicenseRenewedEvent(_userAddress, _licenseName, _expirationTimestamp);
  }

  function revokeUserLicense(
    address _userAddress, string _licenseName
  )
    external
    onlyValidAddress(_userAddress)
    onlyValidLicenseName(_licenseName)
    onlyAllowedManager('revoke_license')
  {
    require(userLicenses[_userAddress][_licenseName] == true);

    userLicenses[_userAddress][_licenseName] = false;
    userLicensesExpiration[_userAddress][_licenseName] = 0;

    UserLicenseRevokedEvent(_userAddress, _licenseName);
  }


  /* CrydrLicenseRegistryInterface */

  function isUserAdmitted(
    address _userAddress
  )
    public
    constant
    onlyValidAddress(_userAddress)
    returns (bool)
  {
    return userAdmittance[_userAddress];
  }

  function isUserGranted(
    address _userAddress, string _licenseName
  )
    public
    constant
    onlyValidAddress(_userAddress)
    onlyValidLicenseName(_licenseName)
    returns (bool)
  {
    return userLicenses[_userAddress][_licenseName];
  }

  function isUserLicenseValid(
    address _userAddress, string _licenseName
  )
    public
    constant
    onlyValidAddress(_userAddress)
    onlyValidLicenseName(_licenseName)
    returns (bool)
  {
    return userLicenses[_userAddress][_licenseName] &&
           (userLicensesExpiration[_userAddress][_licenseName] >= now);
  }

  function isUserAllowed(
    address _userAddress, string _licenseName
  )
    public
    constant
    onlyValidAddress(_userAddress)
    onlyValidLicenseName(_licenseName)
    returns (bool)
  {
    return userAdmittance[_userAddress] &&
           userLicenses[_userAddress][_licenseName] &&
           (userLicensesExpiration[_userAddress][_licenseName] >= now);
  }


  /* Helpers */

  modifier onlyValidAddress(address _userAddress) {
    require(_userAddress != address(0x0));
    _;
  }

  modifier onlyValidLicenseName(string _licenseName) {
    require(bytes(_licenseName).length > 0);
    _;
  }
}
