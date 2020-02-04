/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;

import '../util/CommonModifiers/CommonModifiers.sol';
import '../feature/AssetID/AssetID.sol';
import '../lifecycle/Ownable/Ownable.sol';
import '../lifecycle/Manageable/Manageable.sol';
import '../lifecycle/Pausable/Pausable.sol';
import '../crydr/controller/CrydrControllerBase/CrydrControllerBase.sol';


/**
 * @title CrydrControllerMintableMock
 * @dev Contract for unit tests
 */
contract CrydrControllerBaseMock is CommonModifiers,
                                    AssetID,
                                    Ownable,
                                    Manageable,
                                    CrydrControllerBase,
                                    Pausable{

  constructor (string memory _assetID) public AssetID(_assetID) {}
}
