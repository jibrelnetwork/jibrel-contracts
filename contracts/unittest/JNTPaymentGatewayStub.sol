/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../lifecycle/Ownable/Ownable.sol';
import '../lifecycle/Manageable/Manageable.sol';
import '../crydr/jnt/JNTPaymentGateway/JNTPaymentGatewayInterface.sol';


/**
 * @title JNTPaymentGatewayStub
 */
contract JNTPaymentGatewayStub is Ownable,
                                  Manageable,
                                  JNTPaymentGatewayInterface {

  /* Storage */

  uint256 public counter = 0;


  /* JNTPaymentGateway */

  function chargeJNT(address _from, address _to, uint256 _value) public {
    counter += 1;
    emit JNTChargedEvent(msg.sender, _from, _to, _value);
  }
}
