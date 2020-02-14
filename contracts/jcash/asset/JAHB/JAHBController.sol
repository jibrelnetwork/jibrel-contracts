/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../assetbase/JCashCrydrControllerLicensed.sol';


contract JAHBController is JCashCrydrControllerLicensed {
  constructor () public JCashCrydrControllerLicensed('JSUK-AHB-2018') {}
}
