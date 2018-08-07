/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../util/CommonModifiers/CommonModifiers.sol';
import '../../feature/AssetID/AssetID.sol';
import '../../lifecycle/Ownable/Ownable.sol';
import '../../lifecycle/Manageable/Manageable.sol';
import '../../lifecycle/Pausable/Pausable.sol';
import '../../feature/BytecodeExecutor/BytecodeExecutor.sol';
import '../controller/CrydrControllerBase/CrydrControllerBase.sol';
import '../controller/CrydrControllerBlockable/CrydrControllerBlockable.sol';
import '../controller/CrydrControllerMintable/CrydrControllerMintable.sol';
import '../controller/CrydrControllerERC20/CrydrControllerERC20.sol';
import '../../crydr/controller/CrydrControllerLicensedBase/CrydrControllerLicensedBase.sol';
import '../../crydr/controller/CrydrControllerLicensedERC20/CrydrControllerLicensedERC20.sol';


/**
 * @title JCashCrydrControllerLicensed
 * @dev Mediates views and storage of an licensed CryDR
 */
contract JCashCrydrControllerLicensed is CommonModifiers,
                                         AssetID,
                                         Ownable,
                                         Manageable,
                                         Pausable,
                                         BytecodeExecutor,
                                         CrydrControllerBase,
                                         CrydrControllerBlockable,
                                         CrydrControllerMintable,
                                         CrydrControllerERC20,
                                         CrydrControllerLicensedBase,
                                         CrydrControllerLicensedERC20 {

  // todo make it JNTPayableService

  /* Constructor */

  constructor (string _assetID)
    public
    AssetID(_assetID)
  {}
}
