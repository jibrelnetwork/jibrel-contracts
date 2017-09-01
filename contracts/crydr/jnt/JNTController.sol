/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


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

  function transfer(address _msgsender, address _to, uint _value) external onlyCrydrView whenContractNotPaused {
    CrydrStorageERC20Interface(address(crydrStorage)).transfer(_msgsender, _to, _value);

    for (uint i = 0; i < crydrViewsAddressesList.length; i += 1) {
      // todo check gas consumption, do we need to optimise these type conversions ?
      CrydrViewERC20LoggableInterface(crydrViewsAddressesList[i]).emitTransferEvent(_msgsender, _to, _value);
    }
  }

  function getTotalSupply() external constant returns (uint) {
    // todo check gas consumption, do we need to optimise these type conversions ?
    return CrydrStorageBaseInterface(address(crydrStorage)).getTotalSupply();
  }

  function getBalance(address _owner) external constant returns (uint balance) {
    // todo check gas consumption, do we need to optimise these type conversions ?
    return CrydrStorageBaseInterface(address(crydrStorage)).getBalance(_owner);
  }

  function approve(address _msgsender, address _spender, uint _value) external onlyCrydrView whenContractNotPaused {
    // https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    require(crydrStorage.getAllowance(_msgsender, _spender) >= 0);

    // todo check gas consumption, do we need to optimise these type conversions ?
    CrydrStorageERC20Interface(address(crydrStorage)).approve(_msgsender, _spender, _value);

    for (uint i = 0; i < crydrViewsAddressesList.length; i += 1) {
      // todo check gas consumption, do we need to optimise these type conversions ?
      CrydrViewERC20LoggableInterface(crydrViewsAddressesList[i]).emitApprovalEvent(_msgsender, _spender, _value);
    }
  }

  function transferFrom(address _msgsender, address _from, address _to, uint _value) external onlyCrydrView whenContractNotPaused {
    // todo check gas consumption, do we need to optimise these type conversions ?
    CrydrStorageERC20Interface(address(crydrStorage)).transferFrom(_msgsender, _from, _to, _value);

    for (uint i = 0; i < crydrViewsAddressesList.length; i += 1) {
      // todo check gas consumption, do we need to optimise these type conversions ?
      CrydrViewERC20LoggableInterface(crydrViewsAddressesList[i]).emitTransferEvent(_from, _to, _value);
    }
  }

  function getAllowance(address _owner, address _spender) external constant returns (uint remaining) {
    // todo check gas consumption, do we need to optimise these type conversions ?
    return CrydrStorageBaseInterface(address(crydrStorage)).getAllowance(_owner, _spender);
  }

  /* JNTControllerInterface */

  function chargeJNT(address _from, address _to, uint _value) external onlyAllowedManager('jnt_payable_service') {
    // todo check gas consumption, do we need to optimise these type conversions ?
    CrydrStorageERC20Interface(address(crydrStorage)).transfer(_from, _to, _value);
    JNTChargedEvent(msg.sender, _from, _to, _value);
  }
}
