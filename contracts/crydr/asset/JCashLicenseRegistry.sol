/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../feature/AssetID/AssetID.sol';
import '../../lifecycle/Ownable/Ownable.sol';
import '../../lifecycle/Manageable/Manageable.sol';
import '../../lifecycle/Pausable/Pausable.sol';
import '../../feature/BytecodeExecutor/BytecodeExecutor.sol';
import '../license/CrydrLicenseRegistry.sol';


/**
 * @title JCashLicenseRegistry
 * @dev Contract that stores licenses
 */
contract JCashLicenseRegistry is AssetID,
                                 Ownable,
                                 Manageable,
                                 Pausable,
                                 BytecodeExecutor,
                                 CrydrLicenseRegistry {

  /* Constructor */

  constructor (string _assetID) AssetID(_assetID) public { }
}
