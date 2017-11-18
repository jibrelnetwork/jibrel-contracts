/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/storage/CrydrStorage.sol";


contract jCNYStorage is CrydrStorage {
  function jCNYStorage() CrydrStorage(0x2) {}
}
