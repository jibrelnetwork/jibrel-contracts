/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;

import '../../crydr/asset/JCashCrydrViewERC20.sol';


contract JNTViewERC20 is JCashCrydrViewERC20 {
  constructor () public JCashCrydrViewERC20('JNT', 'Jibrel Network Token', 'JNT', 18) {}
}
