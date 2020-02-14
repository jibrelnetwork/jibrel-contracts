/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import './JCashCrydrStorageForJNT.sol';


contract JNTStorage is JCashCrydrStorageForJNT {
  constructor () JCashCrydrStorageForJNT('JNT') public {}
}
