/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../assetbase/JCashCrydrViewERC20.sol';


contract JEURViewERC20 is JCashCrydrViewERC20 {
  constructor () public JCashCrydrViewERC20('JEUR', 'Euro', 'JEUR', 18) {}
}
