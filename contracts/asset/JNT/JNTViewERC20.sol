/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import "../../crydr/view/CrydrViewERC20.sol";


contract JNTViewERC20 is CrydrViewERC20 {

  function JNTViewERC20() public CrydrViewERC20('JNT', 'Jibrel Network Token', 'JNT', 18) {}
}
