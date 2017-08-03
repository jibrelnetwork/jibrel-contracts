/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


import '../../crydr/view/CrydrViewERC20.sol';


contract jEURViewERC20 is CrydrViewERC20 {
  function jEURViewERC20() CrydrViewERC20("Euro", "jEUR", 18) {}
}
