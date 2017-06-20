pragma solidity ^0.4.11;


/* Author: Victor Mezrin  victor@mezrin.com */


import "../token/NamedToken.sol";
import "./BondsToken.sol";


/**
 * @title jTBill
 */
contract jTBill is BondsToken, NamedToken {
  function jTBill(address _investorsRepository) BondsToken(_investorsRepository) NamedToken('US Treasury CryDR', 'jTBill', 18) {}
}
