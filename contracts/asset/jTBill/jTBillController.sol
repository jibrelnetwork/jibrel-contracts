/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/controller/CrydrControllerSingleLicense.sol";


contract jTBillController is CrydrControllerSingleLicense {
  function jTBillController() CrydrControllerSingleLicense("treasury_bill_license", 0x7) {}
}
