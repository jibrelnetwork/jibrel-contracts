/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;

import '../../crydr/asset/JCashCrydrViewERC20.sol';


contract jEURViewERC20 is JCashCrydrViewERC20 {
  constructor () public JCashCrydrViewERC20('jEUR', 'Euro', 'jEUR', 18) {}
}
