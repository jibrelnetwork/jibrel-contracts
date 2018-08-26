/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../util/CommonModifiers/CommonModifiers.sol';
import '../feature/AssetID/AssetID.sol';
import '../lifecycle/Ownable/Ownable.sol';
import '../lifecycle/Manageable/Manageable.sol';
import '../lifecycle/Pausable/Pausable.sol';
import '../feature/BytecodeExecutor/BytecodeExecutor.sol';
import '../crydr/controller/CrydrControllerBase/CrydrControllerBase.sol';
import '../crydr/controller/CrydrControllerBlockable/CrydrControllerBlockable.sol';
import '../crydr/controller/CrydrControllerMintable/CrydrControllerMintable.sol';
import '../crydr/controller/CrydrControllerERC20/CrydrControllerERC20.sol';
import '../crydr/controller/CrydrControllerForcedTransfer/CrydrControllerForcedTransfer.sol';
import '../crydr/jnt/JNTPaymentGateway/JNTPaymentGateway.sol';

import '../crydr/storage/CrydrStorageERC20/CrydrStorageERC20Interface.sol';


/**
 * @title JNTController
 * @dev Mediates views and storage of JNT, provides additional methods for Jibrel contracts
 */
contract JNTController is CommonModifiers,
                          AssetID,
                          Ownable,
                          Manageable,
                          Pausable,
                          BytecodeExecutor,
                          CrydrControllerBase,
                          CrydrControllerBlockable,
                          CrydrControllerMintable,
                          CrydrControllerERC20,
                          CrydrControllerForcedTransfer,
                          JNTPaymentGateway {

  /* Constructor */

  constructor () AssetID('JNT') public {}
}
