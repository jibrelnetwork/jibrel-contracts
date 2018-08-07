/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;

import '../../crydr/asset/JCashCrydrStorage.sol';


contract JEURStorage is JCashCrydrStorage {
  constructor () public JCashCrydrStorage('JEUR') {}
}
