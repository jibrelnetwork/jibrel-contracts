/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import './JCashCrydrViewERC20ForJNT.sol';


contract JNTViewERC20 is JCashCrydrViewERC20ForJNT {
  constructor () public JCashCrydrViewERC20ForJNT('JNT', 'Jibrel Network Token', 'JNT', 18) {}
}
