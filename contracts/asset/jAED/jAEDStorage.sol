/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/storage/CrydrStorage.sol";


contract jAEDStorage is CrydrStorage {
  function jAEDStorage() CrydrStorage('jAED') {}
}
