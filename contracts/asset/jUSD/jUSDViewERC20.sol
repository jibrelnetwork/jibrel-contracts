/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


import '../../crydr/view/CrydrViewERC20.sol';


contract jUSDViewERC20 is CrydrViewERC20 {
  function jUSDViewERC20() CrydrViewERC20("United States dollar", "jUSD", 18) {}
}
