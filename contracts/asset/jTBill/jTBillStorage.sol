/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/storage/CrydrStorage.sol";


contract jTBillStorage is CrydrStorage {
  function jTBillStorage() CrydrStorage(0x7) {}
}
