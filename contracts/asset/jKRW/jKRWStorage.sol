/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../crydr/storage/CrydrStorage.sol';


contract jKRWStorage is CrydrStorage {
  function jKRWStorage() public CrydrStorage('jKRW') {}
}
