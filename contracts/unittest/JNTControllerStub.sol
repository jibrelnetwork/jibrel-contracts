/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../crydr/jnt/JNTControllerInterface.sol';


/**
 * @title JNTControllerStub
 */
contract JNTControllerStub is JNTControllerInterface {

  /* Storage */

  uint256 public counter = 0;


  /* JNTControllerInterface */

  function chargeJNT(address _from, address _to, uint256 _value) public {
    counter += 1;
    emit JNTChargedEvent(msg.sender, _from, _to, _value);
  }
}
