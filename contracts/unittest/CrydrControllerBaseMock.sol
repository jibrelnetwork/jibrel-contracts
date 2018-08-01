/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;

import '../util/CommonModifiers.sol';
import '../feature/assetid/AssetID.sol';
import '../lifecycle/Ownable.sol';
import '../lifecycle/Manageable.sol';
import '../lifecycle/Pausable.sol';
import '../crydr/controller/CrydrControllerBase.sol';


/**
 * @title CrydrControllerMintableMock
 * @dev Contract for unit tests
 */
contract CrydrControllerBaseMock is CommonModifiers,
                                    AssetID,
                                    Ownable,
                                    Manageable,
                                    Pausable,
                                    CrydrControllerBase {

  constructor (string _assetID) public AssetID(_assetID) {}
}
