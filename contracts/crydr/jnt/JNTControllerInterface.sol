/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


/**
 * @title JNTController interface
 * @dev Contains helper methods of JNT controller that needed by other Jibrel contracts
 */
contract JNTControllerInterface {

  /* Events */

  event JNTChargedEvent(address indexed payableservice, address indexed from, address indexed to, uint value);


  /* Actions */

  function chargeJNT(address _from, address _to, uint _value);
}
