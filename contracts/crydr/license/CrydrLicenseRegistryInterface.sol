/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


/**
 * @title CrydrLicenseRegistryInterface
 * @dev Interface of the contract that stores licenses
 */
contract CrydrLicenseRegistryInterface {

  /**
   * @dev Function to check licenses of investor
   * @param _userAddress address User`s address
   * @param _licenseName string  License name
   * @return True if investor is admitted and has required license
   */
  function isUserAllowed(address _userAddress, string _licenseName) public constant returns (bool);
}
