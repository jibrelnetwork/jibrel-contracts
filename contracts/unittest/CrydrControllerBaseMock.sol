/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import '../feature/assetid/AssetID.sol';
import '../crydr/controller/CrydrControllerBase.sol';


/**
 * @title CrydrControllerMintableMock
 * @dev Contract for unit tests
 */
contract CrydrControllerBaseMock is AssetID,
                                    CrydrControllerBase {

  function CrydrControllerBaseMock(string _assetID) public AssetID(_assetID) {}
}
