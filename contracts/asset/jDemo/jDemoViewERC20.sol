/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;

import '../../crydr/asset/JCashCrydrViewERC20Meta.sol';


contract jDemoViewERC20 is JCashCrydrViewERC20Meta {
  constructor () public JCashCrydrViewERC20Meta('jDemo', 'Demo CryDR', 'jDEMO', 18) {}
}
