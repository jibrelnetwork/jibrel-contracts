/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;

import '../../util/CommonModifiers.sol';
import '../../feature/assetid/AssetID.sol';
import '../../lifecycle/Ownable.sol';
import '../../lifecycle/Manageable.sol';
import '../../lifecycle/Pausable.sol';
import '../../feature/bytecode/BytecodeExecutor.sol';
import '../controller/CrydrControllerBase.sol';
import '../controller/CrydrControllerBlockable.sol';
import '../controller/CrydrControllerMintable.sol';
import '../controller/CrydrControllerERC20.sol';
import '../../crydr/controller/CrydrControllerLicensedBase.sol';
import '../../crydr/controller/CrydrControllerLicensedERC20.sol';


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
