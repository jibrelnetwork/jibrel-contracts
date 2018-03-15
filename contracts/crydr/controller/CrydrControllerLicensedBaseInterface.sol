/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


/**
 * @title CrydrControllerLicensedBaseInterface interface
 * @dev Interface of a contract that checks user's licenses
 */
contract CrydrControllerLicensedBaseInterface {

  /* Events */

  event LicenseRegistryChangedEvent(address indexed licenseregistry);


  /* Configuration */

  function setLicenseRegistry(address _newLicenseRegistry) external;
  function getLicenseRegistryAddress() public constant returns (address);
}
