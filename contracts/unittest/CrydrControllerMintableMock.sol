/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import '../feature/assetid/AssetID.sol';
import '../crydr/controller/CrydrControllerMintable.sol';


/**
 * @title CrydrControllerMintableMock
 * @dev Contract for unit tests
 */
contract CrydrControllerMintableMock is AssetID,
                                        CrydrControllerMintable {

  function CrydrControllerMintableMock(string _assetID) public AssetID(_assetID) {}
}
