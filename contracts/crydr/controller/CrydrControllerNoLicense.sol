/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


import "../jnt_payable_service/JNTPayableServiceERC20.sol";
import "../storage/CrydrStorageERC20Interface.sol";
import "../view/CrydrViewERC20LoggableInterface.sol";
import "./CrydrControllerBase.sol";
import "./CrydrControllerMintable.sol";
import "./CrydrControllerERC20Interface.sol";
import "./CrydrControllerERC20Validatable.sol";


contract CrydrControllerNoLicense is CrydrControllerBase,
                                     CrydrControllerMintable,
                                     CrydrControllerERC20Interface,
                                     CrydrERC20ValidatableInterface,
                                     JNTPayableServiceERC20 {

  /* CrydrControllerERC20Interface */

  /* ERC20 support. _msgsender - account that invoked CrydrView */

  function transfer(address _msgsender, address _to, uint _value) onlyCrydrView whenContractNotPaused {
    chargeJNT(_msgsender, jntBeneficiary, jntPriceTransfer);

    CrydrStorageERC20Interface(address(crydrStorage)).transfer(_msgsender, _to, _value);

    for (uint i = 0; i < crydrViewsAddressesList.length; i += 1) {
      CrydrViewERC20LoggableInterface(crydrViewsAddressesList[i]).emitTransferEvent(_msgsender, _to, _value);
    }
  }

  function transferFrom(address _msgsender, address _from, address _to, uint _value) onlyCrydrView whenContractNotPaused {
    chargeJNT(_msgsender, jntBeneficiary, jntPriceTransferFrom);

    CrydrStorageERC20Interface(address(crydrStorage)).transferFrom(_msgsender, _from, _to, _value);

    for (uint i = 0; i < crydrViewsAddressesList.length; i += 1) {
      CrydrViewERC20LoggableInterface(crydrViewsAddressesList[i]).emitTransferEvent(_from, _to, _value);
    }
  }

  function approve(address _msgsender, address _spender, uint _value) onlyCrydrView whenContractNotPaused {
    // https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    require(crydrStorage.getAllowance(_msgsender, _spender) >= 0);

    chargeJNT(_msgsender, jntBeneficiary, jntPriceApprove);

    CrydrStorageERC20Interface(address(crydrStorage)).approve(_msgsender, _spender, _value);

    for (uint i = 0; i < crydrViewsAddressesList.length; i += 1) {
      CrydrViewERC20LoggableInterface(crydrViewsAddressesList[i]).emitApprovalEvent(_msgsender, _spender, _value);
    }
  }


  /* CrydrERC20ValidatableInterface */

  /* Getters */

  function isRegulated() constant returns (bool) {
    return false;
  }

  function isReceivingAllowed(address _account, uint _value) constant returns (bool) {
    return true;
  }

  function isSpendingAllowed(address _account, uint _value) constant returns (bool) {
    return true;
  }


  function isTransferAllowed(address _from, address _to, uint _value) constant returns (bool) {
    return true;
  }


  function isApproveAllowed(address _from, address _spender, uint _value) constant returns (bool) {
    return true;
  }

  function isApprovedSpendingAllowed(address _from, address _spender, uint _value) constant returns (bool) {
    return true;
  }

  function isTransferFromAllowed(address _spender, address _from, address _to, uint _value) constant returns (bool) {
    return true;
  }
}
