/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../crydr/asset/JCashCrydrController.sol';


contract jUSDController is JCashCrydrController {
  function jUSDController() public JCashCrydrController('jUSD') {}
}
