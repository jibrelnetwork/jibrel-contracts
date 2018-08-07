/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;

import '../../crydr/asset/JCashCrydrViewERC20.sol';


contract JJODViewERC20 is JCashCrydrViewERC20 {
  constructor () public JCashCrydrViewERC20('JJOD', 'Jordanian Dinar', 'JJOD', 18) {}
}
