/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


/**
 * @title CrydrLicenseRegistryInterface
 * @dev Interface of the contract that stores licenses
 */
contract CrydrLicenseRegistryInterface {

  /**
   * @dev Function to check admittance of an user
   * @param _userAddress address User`s address
   * @return True if investor is in the registry and admitted
   */
  function isUserAdmitted(address _userAddress) public constant returns (bool);

  /**
   * @dev Function to check license of an investor
   * @param _userAddress address User`s address
   * @param _licenseName string  License name
   * @return True if investor has been granted needed license
   */
  function isUserGranted(address _userAddress, string _licenseName) public constant returns (bool);

  /**
   * @dev Function to check license of an investor
   * @param _userAddress address User`s address
   * @param _licenseName string  License name
   * @return True if investor`s license is valid
   */
  function isUserLicenseValid(address _userAddress, string _licenseName) public constant returns (bool);

  /**
   * @dev Function to check licenses of investor
   * @param _userAddress address User`s address
   * @param _licenseName string  License name
   * @return True if investor is admitted, granted with needed license and license is valid
   */
  function isUserAllowed(address _userAddress, string _licenseName) public constant returns (bool);
}
