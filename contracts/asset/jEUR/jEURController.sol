/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/controller/CrydrControllerNoLicense.sol";


contract jEURController is CrydrControllerNoLicense {
  function jEURController() CrydrControllerNoLicense(0x3) {}
}
