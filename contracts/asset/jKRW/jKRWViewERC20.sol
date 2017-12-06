/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import '../../crydr/view/CrydrViewERC20.sol';


contract jKRWViewERC20 is CrydrViewERC20 {
  function jKRWViewERC20() public CrydrViewERC20('jKRW', "South Korean Won", "jKRW", 18) {}
}
