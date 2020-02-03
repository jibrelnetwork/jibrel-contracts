/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../../util/CommonModifiers/CommonModifiersInterface.sol';
import '../../../lifecycle/Manageable/ManageableInterface.sol';
import '../../../lifecycle/Pausable/PausableInterface.sol';
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

  function getLicenseRegistryAddress() public view returns (address) {
    return licenseRegistry;
  }
}
