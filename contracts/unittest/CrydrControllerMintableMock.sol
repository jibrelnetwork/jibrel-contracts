/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import '../util/CommonModifiers.sol';
import '../feature/assetid/AssetID.sol';
import '../lifecycle/Ownable.sol';
import '../lifecycle/Manageable.sol';
import '../lifecycle/Pausable.sol';
import '../crydr/controller/CrydrControllerBase.sol';
import '../crydr/controller/CrydrControllerMintable.sol';


/**
 * @title CrydrControllerMintableMock
 * @dev Contract for unit tests
 */
contract CrydrControllerMintableMock is CommonModifiers,
                                        AssetID,
                                        Ownable,
                                        Manageable,
                                        Pausable,
                                        CrydrControllerBase,
                                        CrydrControllerMintable {

  function CrydrControllerMintableMock(string _assetID) public AssetID(_assetID) {}
}
