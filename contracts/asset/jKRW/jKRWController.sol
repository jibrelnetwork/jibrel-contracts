/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../crydr/asset/JCashCrydrController.sol';


contract jKRWController is JCashCrydrController {
  constructor () public JCashCrydrController('jKRW') {}
}
