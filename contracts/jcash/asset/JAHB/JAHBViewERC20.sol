/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../assetbase/JCashCrydrViewERC20.sol';


contract JAHBViewERC20 is JCashCrydrViewERC20 {
  constructor () public JCashCrydrViewERC20('JSUK-AHB-2018', 'JSukuk AHB 0.1', 'JSUK-AHB', 18) {}
}
