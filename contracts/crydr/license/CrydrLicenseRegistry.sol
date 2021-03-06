/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import "../../lifecycle/Manageable/ManageableInterface.sol";
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


  /* CrydrLicenseRegistryInterface */

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
           userLicenses[_userAddress][_licenseName];
  }


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

    emit UserAdmittedEvent(_userAddress);
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

    emit UserDeniedEvent(_userAddress);
  }

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


  function grantUserLicense(
    address _userAddress, string _licenseName
  )
    external
    onlyValidAddress(_userAddress)
    onlyValidLicenseName(_licenseName)
    onlyAllowedManager('grant_license')
  {
    require(userLicenses[_userAddress][_licenseName] == false);

    userLicenses[_userAddress][_licenseName] = true;

    emit UserLicenseGrantedEvent(_userAddress, keccak256(_licenseName));
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

    emit UserLicenseRevokedEvent(_userAddress, keccak256(_licenseName));
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
    return userLicenses[_userAddress][_licenseName];
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
