/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.11;


import "../storage/CrydrStorageERC20Interface.sol";
import "../view/CrydrViewERC20LoggableInterface.sol";
import "../controller/CrydrControllerBase.sol";
import "../controller/CrydrControllerMintable.sol";
import "../controller/CrydrControllerERC20Interface.sol";
import "./JNTControllerInterface.sol";


/**
 * @title JNTController
 * @dev Mediates views and storage of JNT, provides additional methods for Jibrel contracts
 */
contract JNTController is CrydrControllerBase,
                          CrydrControllerMintable,
                          CrydrControllerERC20Interface,
                          JNTControllerInterface {

  /* CrydrControllerERC20Interface */
  /* ERC20 support. _msgsender - account that invoked CrydrView */

  function transfer(address _msgsender, address _to, uint _value) onlyCrydrView whenNotPaused {
    CrydrStorageERC20Interface(address(crydrStorage)).transfer(_msgsender, _to, _value);

    for (uint i = 0; i < crydrViewsAddressesList.length - 1; i += 1) {
      CrydrViewERC20LoggableInterface(crydrViewsAddressesList[i]).emitTransferEvent(_msgsender, _to, _value);
    }
  }

  function transferFrom(address _msgsender, address _from, address _to, uint _value) onlyCrydrView whenNotPaused {
    CrydrStorageERC20Interface(address(crydrStorage)).transferFrom(_msgsender, _from, _to, _value);

    for (uint i = 0; i < crydrViewsAddressesList.length - 1; i += 1) {
      CrydrViewERC20LoggableInterface(crydrViewsAddressesList[i]).emitTransferEvent(_from, _to, _value);
    }
  }

  function approve(address _msgsender, address _spender, uint _value) onlyCrydrView whenNotPaused {
    // https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    if ((_value != 0) && (crydrStorage.getAllowance(_msgsender, _spender) != 0)) throw;

    CrydrStorageERC20Interface(address(crydrStorage)).approve(_msgsender, _spender, _value);

    for (uint i = 0; i < crydrViewsAddressesList.length - 1; i += 1) {
      CrydrViewERC20LoggableInterface(crydrViewsAddressesList[i]).emitApprovalEvent(_msgsender, _spender, _value);
    }
  }


  /* JNTControllerInterface */

  function chargeJNT(address _from, address _to, uint _value) onlyAllowedManager('jnt_payable_service') {
    CrydrStorageERC20Interface(address(crydrStorage)).transfer(_from, _to, _value);
    JNTChargedEvent(msg.sender, _from, _to, _value);
  }
}
