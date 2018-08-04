/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../crydr/asset/JCashCrydrControllerLicensed.sol';


contract jUSDController is JCashCrydrControllerLicensed {
  constructor () public JCashCrydrControllerLicensed('jUSD') {}
}
