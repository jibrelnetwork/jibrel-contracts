/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../crydr/asset/JCashCrydrControllerLicensed.sol';


contract jGBPController is JCashCrydrControllerLicensed {
  constructor () public JCashCrydrControllerLicensed('jGBP') {}
}
