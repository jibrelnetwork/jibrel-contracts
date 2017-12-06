/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../crydr/jnt/JNTControllerInterface.sol";


/**
 * @title JNTControllerStub
 */
contract JNTControllerStub is JNTControllerInterface {

  /* Storage */

  uint256 public counter = 0;


  /* JNTControllerInterface */

  function chargeJNT(address _from, address _to, uint256 _value) {
    counter += 1;
    JNTChargedEvent(msg.sender, _from, _to, _value);
  }
}
