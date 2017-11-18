/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/controller/CrydrControllerNoLicense.sol";


contract jUSDController is CrydrControllerNoLicense {
  function jUSDController() CrydrControllerNoLicense(0x8) {}
}
