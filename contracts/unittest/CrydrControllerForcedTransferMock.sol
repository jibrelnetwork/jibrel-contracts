/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import '../util/CommonModifiers.sol';
import '../feature/assetid/AssetID.sol';
import '../lifecycle/Ownable.sol';
import '../lifecycle/Manageable.sol';
import '../lifecycle/Pausable.sol';
import '../crydr/controller/CrydrControllerBase.sol';
import '../crydr/controller/CrydrControllerMintable.sol';
import '../crydr/controller/CrydrControllerForcedTransfer.sol';


/**
 * @title CrydrControllerForcedTransfer
 * @dev Contract for unit tests
 */
contract CrydrControllerForcedTransferMock is CommonModifiers,
                                              AssetID,
                                              Ownable,
                                              Manageable,
                                              Pausable,
                                              CrydrControllerBase,
                                              CrydrControllerMintable,
                                              CrydrControllerForcedTransfer {

  constructor (string _assetID) public AssetID(_assetID) {}
}
