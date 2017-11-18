/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import '../../crydr/view/CrydrViewERC20.sol';


contract jCNYViewERC20 is CrydrViewERC20 {
  function jCNYViewERC20() CrydrViewERC20("Chinese yuan", "jCNY", 18, 0x2) {}
}
