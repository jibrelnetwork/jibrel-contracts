/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../feature/assetid/AssetID.sol';
import '../../feature/bytecode/BytecodeExecutor.sol';
import '../../crydr/controller/CrydrControllerBlockable.sol';
import '../../crydr/controller/CrydrControllerMintable.sol';
import '../../crydr/controller/CrydrControllerERC20.sol';
import '../../crydr/jnt/JNTControllerInterface.sol';

import '../../crydr/storage/CrydrStorageERC20Interface.sol';


/**
 * @title JNTController
 * @dev Mediates views and storage of JNT, provides additional methods for Jibrel contracts
 */
contract JNTController is AssetID,
                          BytecodeExecutor,
                          CrydrControllerBlockable,
                          CrydrControllerMintable,
                          CrydrControllerERC20,
                          JNTControllerInterface {

  /* Constructor */

  function JNTController() AssetID('JNT') public {}


  /* JNTControllerInterface */

  function chargeJNT(
    address _from,
    address _to,
    uint256 _value
  )
    public
    onlyAllowedManager('jnt_payable_service') {
    CrydrStorageERC20Interface(address(crydrStorage)).transfer(_from, _to, _value);
    JNTChargedEvent(msg.sender, _from, _to, _value);
  }
}
