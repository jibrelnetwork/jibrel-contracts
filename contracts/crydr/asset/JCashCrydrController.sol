/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


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
import '../jnt/JNTPayableService.sol';
import '../jnt/JNTPayableServiceERC20.sol';


contract JCashCrydrController is CommonModifiers,
                                 AssetID,
                                 Ownable,
                                 Manageable,
                                 Pausable,
                                 BytecodeExecutor,
                                 CrydrControllerBase,
                                 CrydrControllerBlockable,
                                 CrydrControllerMintable,
                                 CrydrControllerERC20,
                                 JNTPayableService,
                                 JNTPayableServiceERC20 {

  /* Constructor */
  // 10^18 - assumes that JNT has decimals==18, 1JNT per operation

  function JCashCrydrController(string _assetID)
    public
    AssetID(_assetID)
    JNTPayableServiceERC20(10^18, 10^18, 10^18)
  {}


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
    chargeJNTForService(_msgsender, getJntBeneficiary(), getJntPriceForTransfer());
  }

  function approve(
    address _msgsender,
    address _spender,
    uint256 _value
  )
    public
  {
    CrydrControllerERC20.approve(_msgsender, _spender, _value);
    chargeJNTForService(_msgsender, getJntBeneficiary(), getJntPriceForApprove());
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
    chargeJNTForService(_msgsender, getJntBeneficiary(), getJntPriceForTransferFrom());
  }
}
