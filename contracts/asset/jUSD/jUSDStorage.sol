/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../crydr/storage/CrydrStorage.sol';


contract jUSDStorage is CrydrStorage {
  function jUSDStorage() public CrydrStorage('jUSD') {}
}
