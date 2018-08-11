/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


/**
 * @title CrydrLicenseRegistryManagementInterface
 * @dev Interface of the contract that stores licenses
 */
contract CrydrLicenseRegistryManagementInterface {

  /* Events */

  event UserAdmittedEvent(address indexed useraddress);
  event UserDeniedEvent(address indexed useraddress);
  event UserLicenseGrantedEvent(address indexed useraddress, bytes32 licensename);
  event UserLicenseRenewedEvent(address indexed useraddress, bytes32 licensename);
  event UserLicenseRevokedEvent(address indexed useraddress, bytes32 licensename);


  /* Configuration */

  /**
   * @dev Function to admit user
   * @param _userAddress address User`s address
   */
  function admitUser(address _userAddress) external;

  /**
   * @dev Function to deny user
   * @param _userAddress address User`s address
   */
  function denyUser(address _userAddress) external;

  /**
   * @dev Function to check admittance of an user
   * @param _userAddress address User`s address
   * @return True if investor is in the registry and admitted
   */
  function isUserAdmitted(address _userAddress) public constant returns (bool);


  /**
   * @dev Function to grant license to an user
   * @param _userAddress         address User`s address
   * @param _licenseName         string  name of the license
   */
  function grantUserLicense(address _userAddress, string _licenseName) external;

  /**
   * @dev Function to revoke license from the user
   * @param _userAddress address User`s address
   * @param _licenseName string  name of the license
   */
  function revokeUserLicense(address _userAddress, string _licenseName) external;

  /**
   * @dev Function to check license of an investor
   * @param _userAddress address User`s address
   * @param _licenseName string  License name
   * @return True if investor has been granted needed license
   */
  function isUserGranted(address _userAddress, string _licenseName) public constant returns (bool);
}
