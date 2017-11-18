/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../storage/CrydrStorage.sol";


contract JNTStorage is CrydrStorage {
  function JNTStorage() CrydrStorage(0xfffffffe) {}
}
