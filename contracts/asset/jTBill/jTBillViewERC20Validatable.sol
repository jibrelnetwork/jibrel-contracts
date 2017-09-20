/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import '../../crydr/view/CrydrViewERC20Validatable.sol';


contract jTBillViewERC20Validatable is CrydrViewERC20Validatable {
  function jTBillViewERC20Validatable() CrydrViewERC20Validatable("Treasure bill", "jTBill", 18) {}
}
