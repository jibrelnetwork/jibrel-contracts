/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../../util/CommonModifiers/CommonModifiers.sol';
import '../../../lifecycle/Manageable/Manageable.sol';
import '../../../lifecycle/Pausable/Pausable.sol';
import './CrydrControllerLicensedBase.sol';


/**
 * @title CrydrControllerLicensedBase
 * @dev Implementation of a contract that checks user's licenses
 */
contract CrydrControllerLicensedBase is CommonModifiers,
                                        Manageable,
                                        Pausable
                                        {

  /* Storage */

  address licenseRegistry = address(0x0);

  event LicenseRegistryChangedEvent(address indexed licenseregistry);

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

  function getLicenseRegistryAddress() public view returns (address) {
    return licenseRegistry;
  }
}
