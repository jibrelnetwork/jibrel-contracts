/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/storage/CrydrStorage.sol";


contract jKRWStorage is CrydrStorage {
  function jKRWStorage() public CrydrStorage('jKRW') {}
}
