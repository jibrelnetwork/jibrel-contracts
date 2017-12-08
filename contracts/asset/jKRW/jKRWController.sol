/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../crydr/asset/CrydrControllerJCash.sol';


contract jKRWController is CrydrControllerJCash {
  function jKRWController() public CrydrControllerJCash('jKRW') {}
}
