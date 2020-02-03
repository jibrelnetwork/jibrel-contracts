/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../third-party/zeppelin-solidity/SafeMath.sol';
import '../util/CommonModifiers/CommonModifiers.sol';
import '../feature/AssetID/AssetID.sol';
import '../lifecycle/Ownable/Ownable.sol';
import '../lifecycle/Manageable/Manageable.sol';
import '../lifecycle/Pausable/Pausable.sol';
import '../feature/BytecodeExecutor/BytecodeExecutor.sol';
import '../crydr/storage/CrydrStorageBase/CrydrStorageBase.sol';
import '../crydr/storage/CrydrStorageBalance/CrydrStorageBalance.sol';
import '../crydr/storage/CrydrStorageAllowance/CrydrStorageAllowance.sol';
import '../crydr/storage/CrydrStorageBlocks/CrydrStorageBlocks.sol';
import '../crydr/storage/CrydrStorageERC20/CrydrStorageERC20.sol';


/**
 * @title JCashCrydrStorage
 * @dev Implementation of a contract that manages data of an CryDR
 */
contract JCashCrydrStorageForJNT is SafeMath,
                                    CommonModifiers,
                                    AssetID,
                                    Ownable,
                                    Manageable,
                                    BytecodeExecutor,
                                    CrydrStorageBase,
                                    Pausable,
                                    CrydrStorageBalance,
                                    CrydrStorageAllowance,
                                    CrydrStorageBlocks,
                                    CrydrStorageERC20 {

  /* Constructor */

  constructor (string memory _assetID) AssetID(_assetID) public { }
}
