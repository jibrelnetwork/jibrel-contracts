/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../assetbase/JCashCrydrControllerLicensed.sol';


contract JKRWController is JCashCrydrControllerLicensed {
  constructor () public JCashCrydrControllerLicensed('JKRW') {}
}
