/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import '../../crydr/asset/JCashCrydrViewERC20Meta.sol';


contract jDemoViewERC20 is JCashCrydrViewERC20Meta {
  function jDemoViewERC20() public JCashCrydrViewERC20Meta('jDemo', 'Demo CryDR', 'jDEMO', 18) {}
}
