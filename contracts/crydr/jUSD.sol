pragma solidity ^0.4.11;


/* Author: Victor Mezrin  victor@mezrin.com */


import "../token/NamedToken.sol";
import "./FiatToken.sol";


/**
 * @title jUSD
 */
contract jUSD is FiatToken, NamedToken {
  function jUSD() NamedToken('USD CryDR', 'jUSD', 18) {}
}
