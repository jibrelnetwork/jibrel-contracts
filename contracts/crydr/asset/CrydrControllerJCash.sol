/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../storage/CrydrStorageBaseInterface.sol";
import "../storage/CrydrStorageERC20Interface.sol";
import "../view/ERC20LoggableInterface.sol";
import "../controller/CrydrControllerBase.sol";
import "../controller/CrydrControllerBlockable.sol";
import "../controller/CrydrControllerMintable.sol";
import "../controller/CrydrControllerERC20.sol";
import "../jnt/JNTPayableServiceERC20.sol";


contract CrydrControllerJCash is CrydrControllerBase,
                                 CrydrControllerBlockable,
                                 CrydrControllerMintable,
                                 CrydrControllerERC20,
                                 JNTPayableServiceERC20 {

  /* Constructor */

  function CrydrControllerJCash(string _assetID)
    public
    CrydrControllerBase(_assetID)
    JNTPayableServiceERC20(10^18, 10^18, 10^18) {}
    // assumes that JNT has decimals==18, 1JNT per operation


  /* CrydrControllerERC20 */

  /* ERC20 support. _msgsender - account that invoked CrydrView */

  function transfer(
    address _msgsender,
    address _to,
    uint256 _value
  )
    public
  {
    CrydrControllerERC20.transfer(_msgsender, _to, _value);
    chargeJNT(_msgsender, jntBeneficiary, jntPriceTransfer);
  }

  function approve(
    address _msgsender,
    address _spender,
    uint256 _value
  )
    public
  {
    CrydrControllerERC20.approve(_msgsender, _spender, _value);
    chargeJNT(_msgsender, jntBeneficiary, jntPriceApprove);
  }

  function transferFrom(
    address _msgsender,
    address _from,
    address _to,
    uint256 _value
  )
    public
  {
    CrydrControllerERC20.transferFrom(_msgsender, _from, _to, _value);
    chargeJNT(_msgsender, jntBeneficiary, jntPriceTransferFrom);
  }
}
