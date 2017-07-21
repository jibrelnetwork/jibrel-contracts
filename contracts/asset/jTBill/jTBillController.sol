/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.11;


import "../../crydr/controller/CrydrControllerSingleLicense.sol";


contract jTBillController is CrydrControllerSingleLicense {
  function jTBillController() CrydrControllerSingleLicense("treasury_bill_license") {}
}
