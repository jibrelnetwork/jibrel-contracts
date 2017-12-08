/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import "../../crydr/storage/CrydrStorage.sol";


contract JNTStorage is CrydrStorage {
  function JNTStorage() CrydrStorage('JNT') public {}
}
