/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../crydr/asset/JCashLicenseRegistry.sol';


contract jUSDLicenseRegistry is JCashLicenseRegistry {
  constructor () public JCashLicenseRegistry('jUSD') {}
}
