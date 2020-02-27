/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../jcash/assetbase/JCashCrydrViewERC20.sol';


contract DEXTradableSampleView is JCashCrydrViewERC20 {
  constructor () public JCashCrydrViewERC20('DEX_ITEM', 'DEX Tradable Sample', 'DEX_ITEM', 18) {}
}
