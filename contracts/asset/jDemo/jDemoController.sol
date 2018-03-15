/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../crydr/asset/JCashCrydrControllerLicensed.sol';


contract jDemoController is JCashCrydrControllerLicensed {
  function jDemoController() public JCashCrydrControllerLicensed('jDemo') {}
}
