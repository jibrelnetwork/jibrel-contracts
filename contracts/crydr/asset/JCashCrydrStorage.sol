/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../feature/bytecode/BytecodeExecutor.sol';
import '../storage/CrydrStorageERC20.sol';


/**
 * @title CrydrStorage
 * @dev Implementation of a contract that manages data of an CryDR
 */
contract JCashCrydrStorage is BytecodeExecutor,
                              CrydrStorageERC20 {

  /* Constructor */

  function JCashCrydrStorage(string _assetID) AssetID(_assetID) public { }
}
