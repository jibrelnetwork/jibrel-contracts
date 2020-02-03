/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../assetbase/JCashCrydrStorage.sol';


contract JJODStorage is JCashCrydrStorage {
  constructor () public JCashCrydrStorage('JJOD') {}
}
