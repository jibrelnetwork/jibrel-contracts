/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


/**
 * @title JNTPaymentGatewayInterface
 * @dev Allows to charge users by JNT
 */
contract JNTPaymentGatewayInterface {

  /* Events */

  event JNTChargedEvent(address indexed payableservice, address indexed from, address indexed to, uint256 value);


  /* Actions */

  function chargeJNT(address _from, address _to, uint256 _value) public;
}
