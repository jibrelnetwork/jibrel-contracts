/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


import '../../crydr/view/CrydrViewERC20Validatable.sol';


contract jGDRViewERC20Validatable is CrydrViewERC20Validatable {
  function jGDRViewERC20Validatable() CrydrViewERC20Validatable("Global depositary receipt", "jGDR", 18) {}
}
