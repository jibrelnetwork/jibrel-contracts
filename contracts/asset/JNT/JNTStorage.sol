/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;

import '../../crydr/asset/JCashCrydrStorage.sol';


contract JNTStorage is JCashCrydrStorage {
  constructor () JCashCrydrStorage('JNT') public {}
}
