/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../feature/AssetID/AssetID.sol';
import '../../lifecycle/Ownable/Ownable.sol';
import '../../lifecycle/Manageable/Manageable.sol';
import '../../lifecycle/Pausable/Pausable.sol';
import '../../feature/BytecodeExecutor/BytecodeExecutor.sol';
import '../../crydr/license/CrydrLicenseRegistry.sol';


/**
 * @title JCashLicenseRegistry
 * @dev Contract that stores licenses
 */
contract JCashLicenseRegistry is AssetID,
                                 Ownable,
                                 Manageable,
                                 BytecodeExecutor,
                                 CrydrLicenseRegistry,
                                  Pausable
                                 {

  /* Constructor */

  constructor (string memory _assetID) AssetID(_assetID) public { }
}
