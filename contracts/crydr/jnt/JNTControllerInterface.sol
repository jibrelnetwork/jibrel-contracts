/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.11;


/**
 * @title JNTController interface
 * @dev Contains helper methods of JNT controller that needed by other Jibrel contracts
 */
contract JNTControllerInterface {

  /* Events */

  event JNTChargedEvent(address payableservice, address from, address to, uint value);  // todo make indexed


  /* Actions */

  function chargeJNT(address _from, address _to, uint _value);
}
