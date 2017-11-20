/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/controller/CrydrControllerJCash.sol";


contract jAEDController is CrydrControllerJCash {
  function jAEDController() CrydrControllerJCash(0x1) {}
}
