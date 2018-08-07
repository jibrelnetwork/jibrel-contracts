/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../third-party/zeppelin-solidity/SafeMath.sol';
import '../../util/CommonModifiers/CommonModifiers.sol';
import '../../feature/AssetID/AssetID.sol';
import '../../lifecycle/Ownable/Ownable.sol';
import '../../lifecycle/Manageable/Manageable.sol';
import '../../lifecycle/Pausable/Pausable.sol';
import '../../feature/BytecodeExecutor/BytecodeExecutor.sol';
import '../storage/CrydrStorageBase/CrydrStorageBase.sol';
import '../storage/CrydrStorageBalance/CrydrStorageBalance.sol';
import '../storage/CrydrStorageAllowance/CrydrStorageAllowance.sol';
import '../storage/CrydrStorageBlocks/CrydrStorageBlocks.sol';
import '../storage/CrydrStorageERC20/CrydrStorageERC20.sol';


/**
 * @title JCashCrydrStorage
 * @dev Implementation of a contract that manages data of an CryDR
 */
contract JCashCrydrStorage is SafeMath,
                              CommonModifiers,
                              AssetID,
                              Ownable,
                              Manageable,
                              Pausable,
                              BytecodeExecutor,
                              CrydrStorageBase,
                              CrydrStorageBalance,
                              CrydrStorageAllowance,
                              CrydrStorageBlocks,
                              CrydrStorageERC20 {

  /* Constructor */

  constructor (string _assetID) AssetID(_assetID) public { }
}
