/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/controller/CrydrControllerJCash.sol";


contract jCNYController is CrydrControllerJCash {
  function jCNYController() CrydrControllerJCash('jCNY') {}
}
