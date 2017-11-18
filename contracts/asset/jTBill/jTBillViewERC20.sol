/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import '../../crydr/view/CrydrViewERC20.sol';


contract jTBillViewERC20 is CrydrViewERC20 {
  function jTBillViewERC20() CrydrViewERC20("Treasure bill", "jTBill", 18, 0x7) {}
}
