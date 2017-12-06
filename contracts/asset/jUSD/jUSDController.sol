/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/asset/CrydrControllerJCash.sol";


contract jUSDController is CrydrControllerJCash {
  function jUSDController() public CrydrControllerJCash('jUSD') {}
}
