/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import "../lifecycle/Ownable/Ownable.sol";
import "../lifecycle/Manageable/Manageable.sol";
import "../crydr/license/CrydrLicenseRegistry.sol";


/**
 * @title CrydrLicenseRegistry
 * @dev Contract that stores licenses
 */
contract CrydrLicenseRegistryMock is Ownable, Manageable, CrydrLicenseRegistry { }
