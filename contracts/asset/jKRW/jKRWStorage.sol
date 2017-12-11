/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import '../../crydr/asset/JCashCrydrStorage.sol';


contract jKRWStorage is JCashCrydrStorage {
  function jKRWStorage() public JCashCrydrStorage('jKRW') {}
}
