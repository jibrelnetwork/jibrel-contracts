/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../assetbase/JCashCrydrViewERC20.sol';


contract JUSDViewERC20 is JCashCrydrViewERC20 {
  constructor () public JCashCrydrViewERC20('JUSD', 'United States Dollar', 'JUSD', 18) {}
}
