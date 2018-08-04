/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../lifecycle/Ownable.sol';
import '../lifecycle/Manageable.sol';
import '../crydr/jnt/JNTControllerInterface.sol';


/**
 * @title JNTControllerStub
 */
contract JNTControllerStub is Ownable,
                              Manageable,
                              JNTControllerInterface {

  /* Storage */

  uint256 public counter = 0;


  /* JNTControllerInterface */

  function chargeJNT(address _from, address _to, uint256 _value) public {
    counter += 1;
    emit JNTChargedEvent(msg.sender, _from, _to, _value);
  }
}
