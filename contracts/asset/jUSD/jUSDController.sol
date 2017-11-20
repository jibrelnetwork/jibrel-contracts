/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/controller/CrydrControllerJCash.sol";


contract jUSDController is CrydrControllerJCash {
  function jUSDController() CrydrControllerJCash(0x8) {}
}
