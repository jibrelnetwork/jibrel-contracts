/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import './JCashCrydrController.sol';
import '../../crydr/controller/CrydrControllerLicensedBase.sol';
import '../../crydr/controller/CrydrControllerLicensedERC20.sol';


/**
 * @title JCashCrydrControllerLicensed
 * @dev Mediates views and storage of an licensed CryDR
 */
contract JCashCrydrControllerLicensed is JCashCrydrController,
                                         CrydrControllerLicensedBase,
                                         CrydrControllerLicensedERC20 {

  /* Constructor */

  function JCashCrydrControllerLicensed(string _assetID)
    public
    JCashCrydrController(_assetID)
  {}
}
