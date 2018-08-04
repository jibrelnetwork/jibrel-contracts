/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;

import '../../crydr/asset/JCashCrydrViewERC20.sol';


contract jJODViewERC20 is JCashCrydrViewERC20 {
  constructor () public JCashCrydrViewERC20('jJOD', 'Jordanian Dinar', 'jJOD', 18) {}
}
