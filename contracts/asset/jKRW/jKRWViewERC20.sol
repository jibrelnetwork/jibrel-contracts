/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import '../../crydr/asset/JCashCrydrViewERC20.sol';


contract jKRWViewERC20 is JCashCrydrViewERC20 {
  constructor () public JCashCrydrViewERC20('jKRW', 'South Korean Won', 'jKRW', 18) {}
}
