pragma solidity ^0.4.11;


/* Author: Victor Mezrin  victor@mezrin.com */


import "../token/ChangeableSupplyToken.sol";
import "./SingleLicenseToken.sol";


/**
 * @title BondsToken
 */
contract BondsToken is ChangeableSupplyToken, SingleLicenseToken {

  /* Constructor */

  function BondsToken(address _investorsRepository) SingleLicenseToken(_investorsRepository, 'own_bonds') {}
}
