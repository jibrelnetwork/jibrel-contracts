/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../assetbase/JCashCrydrViewERC20.sol';


contract JGBPViewERC20 is JCashCrydrViewERC20 {
  constructor () public JCashCrydrViewERC20('JGBP', 'Pound Sterling', 'JGBP', 18) {}
}
