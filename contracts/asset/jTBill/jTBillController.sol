/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


import "../../crydr/controller/CrydrControllerSingleLicense.sol";


contract jTBillController is CrydrControllerSingleLicense {
  function jTBillController() CrydrControllerSingleLicense("treasury_bill_license") {}
}
