/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../storage/CrydrStorageERC20Interface.sol";
import "../view/CrydrViewERC20LoggableInterface.sol";
import "../controller/CrydrControllerBase.sol";
import "../controller/CrydrControllerMintable.sol";
import "../controller/CrydrControllerERC20.sol";
import "./JNTControllerInterface.sol";


/**
 * @title JNTController
 * @dev Mediates views and storage of JNT, provides additional methods for Jibrel contracts
 */
contract JNTController is CrydrControllerBase,
                          CrydrControllerMintable,
                          CrydrControllerERC20,
                          JNTControllerInterface {

  /* Constructor */

  function JNTController() CrydrControllerBase(0xfffffffe) {}


  /* JNTControllerInterface */

  function chargeJNT(address _from, address _to, uint _value) onlyAllowedManager('jnt_payable_service') {
    CrydrStorageERC20Interface(address(crydrStorage)).transfer(_from, _to, _value);
    JNTChargedEvent(msg.sender, _from, _to, _value);
  }
}
