/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/controller/CrydrControllerJCash.sol";


contract jRUBController is CrydrControllerJCash {
  function jRUBController() CrydrControllerJCash(0x6) {}
}
