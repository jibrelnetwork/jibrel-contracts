/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../crydr/asset/JCashCrydrControllerLicensed.sol';


contract JKRWController is JCashCrydrControllerLicensed {
  constructor () public JCashCrydrControllerLicensed('JKRW') {}
}
