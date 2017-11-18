/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/storage/CrydrStorage.sol";


contract jUSDStorage is CrydrStorage {
  function jUSDStorage() CrydrStorage(0x8) {}
}
