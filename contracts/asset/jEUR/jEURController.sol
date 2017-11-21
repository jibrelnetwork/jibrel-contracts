/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/controller/CrydrControllerJCash.sol";


contract jEURController is CrydrControllerJCash {
  function jEURController() CrydrControllerJCash('jEUR') {}
}
