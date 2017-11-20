/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/controller/CrydrControllerJCash.sol";


contract jGBPController is CrydrControllerJCash {
  function jGBPController() CrydrControllerJCash(0x4) {}
}
