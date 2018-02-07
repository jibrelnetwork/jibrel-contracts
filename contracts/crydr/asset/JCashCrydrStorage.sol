/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../third-party/zeppelin-solidity/SafeMath.sol';
import '../../util/CommonModifiers.sol';
import '../../feature/assetid/AssetID.sol';
import '../../lifecycle/Ownable.sol';
import '../../lifecycle/Manageable.sol';
import '../../lifecycle/Pausable.sol';
import '../../feature/bytecode/BytecodeExecutor.sol';
import '../storage/CrydrStorageBase.sol';
import '../storage/CrydrStorageBalance.sol';
import '../storage/CrydrStorageAllowance.sol';
import '../storage/CrydrStorageBlocks.sol';
import '../storage/CrydrStorageERC20.sol';


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

  function JCashCrydrStorage(string _assetID) AssetID(_assetID) public { }
}
