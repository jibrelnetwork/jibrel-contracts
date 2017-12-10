/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import '../../crydr/storage/CrydrStorage.sol';

import '../../third-party/zeppelin-solidity/SafeMath.sol';
import '../../lifecycle/Pausable.sol';
import '../../util/CommonModifiers.sol';
import '../../feature/bytecode/BytecodeExecutor.sol';
import '../../feature/assetid/AssetID.sol';


contract JNTStorage is CrydrStorage {
  function JNTStorage() CrydrStorage('JNT') public {}
}
