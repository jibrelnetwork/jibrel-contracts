/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import '../../crydr/asset/JCashCrydrStorage.sol';


contract jDemoStorage is JCashCrydrStorage {
  constructor () public JCashCrydrStorage('jDemo') {}
}
