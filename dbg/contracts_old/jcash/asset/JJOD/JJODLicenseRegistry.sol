/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../assetbase/JCashLicenseRegistry.sol';


contract JJODLicenseRegistry is JCashLicenseRegistry {
  constructor () public JCashLicenseRegistry('JJOD') {}
}
