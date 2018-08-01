/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import '../../crydr/asset/JCashLicenseRegistry.sol';


contract jDemoLicenseRegistry is JCashLicenseRegistry {
  constructor () public JCashLicenseRegistry('jDemo') {}
}
