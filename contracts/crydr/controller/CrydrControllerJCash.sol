/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../jnt_payable_service/JNTPayableServiceERC20.sol";
import "../storage/CrydrStorageBaseInterface.sol";
import "../storage/CrydrStorageERC20Interface.sol";
import "../view/CrydrViewERC20LoggableInterface.sol";
import "./CrydrControllerBase.sol";
import "./CrydrControllerBlockable.sol";
import "./CrydrControllerMintable.sol";
import "./CrydrControllerERC20.sol";


contract CrydrControllerJCash is CrydrControllerBase,
                                 CrydrControllerBlockable,
                                 CrydrControllerMintable,
                                 CrydrControllerERC20,
                                 JNTPayableServiceERC20 {

  /* Constructor */

  function CrydrControllerJCash(string _assetID) CrydrControllerBase(_assetID) {}


  /* CrydrControllerERC20 */

  /* ERC20 support. _msgsender - account that invoked CrydrView */

  function transfer(
    address _msgsender,
    address _to,
    uint _value
  ) {
    CrydrControllerERC20.transfer(_msgsender, _to, _value);
    chargeJNT(_msgsender, jntBeneficiary, jntPriceTransfer);
  }

  function approve(
    address _msgsender,
    address _spender,
    uint _value
  ) {
    CrydrControllerERC20.approve(_msgsender, _spender, _value);
    chargeJNT(_msgsender, jntBeneficiary, jntPriceApprove);
  }

  function transferFrom(
    address _msgsender,
    address _from,
    address _to,
    uint _value
  ) {
    CrydrControllerERC20.transferFrom(_msgsender, _from, _to, _value);
    chargeJNT(_msgsender, jntBeneficiary, jntPriceTransferFrom);
  }
}
