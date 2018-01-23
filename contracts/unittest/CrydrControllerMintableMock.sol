/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import '../util/CommonModifiers.sol';
import '../feature/assetid/AssetID.sol';
import '../crydr/controller/CrydrControllerBase.sol';
import '../crydr/controller/CrydrControllerMintable.sol';


/**
 * @title CrydrControllerMintableMock
 * @dev Contract for unit tests
 */
contract CrydrControllerMintableMock is CommonModifiers,
                                        AssetID,
                                        CrydrControllerBase,
                                        CrydrControllerMintable {

  function CrydrControllerMintableMock(string _assetID) public AssetID(_assetID) {}
}
