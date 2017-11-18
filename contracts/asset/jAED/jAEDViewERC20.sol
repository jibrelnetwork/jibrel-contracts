/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import '../../crydr/view/CrydrViewERC20.sol';


contract jAEDViewERC20 is CrydrViewERC20 {
  function jAEDViewERC20() CrydrViewERC20("United Arab Emirates dirham", "jAED", 18, 0x1) {}
}
