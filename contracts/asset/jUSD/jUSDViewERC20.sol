/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import '../../crydr/asset/JCashCrydrViewERC20.sol';


contract jUSDViewERC20 is JCashCrydrViewERC20 {
  function jUSDViewERC20() public JCashCrydrViewERC20('jUSD', 'United States dollar', 'jUSD', 18) {}
}
