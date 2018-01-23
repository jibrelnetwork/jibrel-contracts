/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import '../util/CommonModifiers.sol';
import '../feature/assetid/AssetID.sol';
import '../crydr/controller/CrydrControllerBase.sol';


/**
 * @title CrydrControllerMintableMock
 * @dev Contract for unit tests
 */
contract CrydrControllerBaseMock is CommonModifiers,
                                    AssetID,
                                    CrydrControllerBase {

  function CrydrControllerBaseMock(string _assetID) public AssetID(_assetID) {}
}
