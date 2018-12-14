/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../assetbase/JCashCrydrStorage.sol';


contract JAHBStorage is JCashCrydrStorage {
  constructor () public JCashCrydrStorage('JSUK-AHB-2018') {}
}
