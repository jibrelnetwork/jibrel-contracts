/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../util/CommonModifiersInterface.sol';
import '../../lifecycle/ManageableInterface.sol';
import '../../lifecycle/PausableInterface.sol';
import './CrydrControllerLicensedBaseInterface.sol';


/**
 * @title CrydrControllerLicensedBase
 * @dev Implementation of a contract that checks user's licenses
 */
contract CrydrControllerLicensedBase is CommonModifiersInterface,
                                        ManageableInterface,
                                        PausableInterface,
                                        CrydrControllerLicensedBaseInterface {

  /* Storage */

  address licenseRegistry = address(0x0);


  /* CrydrControllerLicensedBaseInterface */

  function setLicenseRegistry(
    address _newLicenseRegistry
  )
    external
    onlyContractAddress(_newLicenseRegistry)
    onlyAllowedManager('set_license_registry')
    whenContractPaused
  {
    require(_newLicenseRegistry != address(this));
    require(_newLicenseRegistry != licenseRegistry);

    licenseRegistry = _newLicenseRegistry;

    emit LicenseRegistryChangedEvent(_newLicenseRegistry);
  }

  function getLicenseRegistryAddress() public constant returns (address) {
    return licenseRegistry;
  }
}
