/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/controller/CrydrControllerSingleLicense.sol";


contract jGDRController is CrydrControllerSingleLicense {
  function jGDRController() CrydrControllerSingleLicense("gdr_license") {}
}
