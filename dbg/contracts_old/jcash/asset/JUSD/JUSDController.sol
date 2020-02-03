/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../assetbase/JCashCrydrControllerLicensed.sol';


contract JUSDController is JCashCrydrControllerLicensed {
  constructor () public JCashCrydrControllerLicensed('JUSD') {}
}
