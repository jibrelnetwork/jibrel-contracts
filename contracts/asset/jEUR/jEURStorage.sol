/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/storage/CrydrStorage.sol";


contract jEURStorage is CrydrStorage {
  function jEURStorage() CrydrStorage('jEUR') {}
}
