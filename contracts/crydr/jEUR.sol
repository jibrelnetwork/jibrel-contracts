pragma solidity ^0.4.11;


/* Author: Victor Mezrin  victor@mezrin.com */


import "../token/NamedToken.sol";
import "./FiatToken.sol";


/**
 * @title jEUR
 */
contract jEUR is FiatToken, NamedToken {
  function jEUR() NamedToken('EUR CryDR', 'jEUR', 18) {}
}
