/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


import "../jnt_payable_service/JNTPayableServiceERC20.sol";
import "../storage/CrydrStorageBaseInterface.sol";
import "../storage/CrydrStorageERC20Interface.sol";
import "../view/CrydrViewERC20LoggableInterface.sol";
import "./CrydrControllerBase.sol";
import "./CrydrControllerBlockable.sol";
import "./CrydrControllerMintable.sol";
import "./CrydrControllerERC20Interface.sol";
import "./CrydrControllerERC20Validatable.sol";


contract CrydrControllerSingleLicense is CrydrControllerBase,
                                         CrydrControllerBlockable,
                                         CrydrControllerMintable,
                                         CrydrControllerERC20Interface,
                                         CrydrControllerERC20Validatable,
                                         JNTPayableServiceERC20 {

  /* Storage */

  string singleLicenseName;


  /* Constructor */

  function CrydrControllerSingleLicense(string _singleLicenseName)
  {
    require(bytes(_singleLicenseName).length > 0);

    singleLicenseName = _singleLicenseName;
  }


  /* CrydrControllerERC20Interface */

  /* ERC20 support. _msgsender - account that invoked CrydrView */

  function transfer(
    address _msgsender,
    address _to,
    uint _value
  )
    onlyCrydrView
    whenContractNotPaused
    onlyGreaterThanZero(_value)
  {
    if (isTransferAllowed(_msgsender, _to, _value) == false) {
      revert();
    }

    chargeJNT(_msgsender, jntBeneficiary, jntPriceTransfer);

    // todo check gas consumption, do we need to optimise these type conversions ?
    CrydrStorageERC20Interface(address(crydrStorage)).transfer(_msgsender, _to, _value);

    if (crydrViewsAddresses['erc20'] != 0x0) {
        CrydrViewERC20LoggableInterface(crydrViewsAddresses['erc20']).emitTransferEvent(_msgsender, _to, _value);
    }
  }

  function getTotalSupply() constant returns (uint) {
    // todo check gas consumption, do we need to optimise these type conversions ?
    return CrydrStorageBaseInterface(address(crydrStorage)).getTotalSupply();
  }

  function getBalance(address _owner) constant returns (uint balance) {
    // todo check gas consumption, do we need to optimise these type conversions ?
    return CrydrStorageBaseInterface(address(crydrStorage)).getBalance(_owner);
  }

  function approve(
    address _msgsender,
    address _spender,
    uint _value
  )
    onlyCrydrView
    whenContractNotPaused
    onlyGreaterThanZero(_value)
  {
    if (isApproveAllowed(_msgsender, _spender, _value) == false) {
      revert();
    }

    // https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    require(crydrStorage.getAllowance(_msgsender, _spender) >= 0);

    chargeJNT(_msgsender, jntBeneficiary, jntPriceApprove);

    // todo check gas consumption, do we need to optimise these type conversions ?
    CrydrStorageERC20Interface(address(crydrStorage)).approve(_msgsender, _spender, _value);

    if (crydrViewsAddresses['erc20'] != 0x0) {
        CrydrViewERC20LoggableInterface(crydrViewsAddresses['erc20']).emitApprovalEvent(_msgsender, _spender, _value);
    }
  }

  function transferFrom(
    address _msgsender,
    address _from,
    address _to,
    uint _value
  )
    onlyCrydrView
    whenContractNotPaused
    onlyGreaterThanZero(_value)
  {
    if (isTransferFromAllowed(_msgsender, _from, _to, _value) == false) {
      revert();
    }

    chargeJNT(_msgsender, jntBeneficiary, jntPriceTransferFrom);

    // todo check gas consumption, do we need to optimise these type conversions ?
    CrydrStorageERC20Interface(address(crydrStorage)).transferFrom(_msgsender, _from, _to, _value);

    if (crydrViewsAddresses['erc20'] != 0x0) {
        CrydrViewERC20LoggableInterface(crydrViewsAddresses['erc20']).emitTransferEvent(_from, _to, _value);
    }
  }

  function getAllowance(address _owner, address _spender) constant returns (uint remaining) {
    return CrydrStorageBaseInterface(address(crydrStorage)).getAllowance(_owner, _spender);
  }


  /* CrydrERC20ValidatableInterface */

  /* Getters */

  function isRegulated() constant returns (bool) {
    return true;
  }

  function isReceivingAllowed(address _account, uint _value) constant returns (bool) {
    return investorsRegistry.isInvestorAllowed(_account, singleLicenseName);
  }

  function isSpendingAllowed(address _account, uint _value) constant returns (bool) {
    return investorsRegistry.isInvestorAllowed(_account, singleLicenseName);
  }


  function isTransferAllowed(address _from, address _to, uint _value) constant returns (bool) {
    return investorsRegistry.isInvestorAllowed(_from, singleLicenseName) &&
           investorsRegistry.isInvestorAllowed(_to, singleLicenseName);
  }


  function isApproveAllowed(address _from, address _spender, uint _value) constant returns (bool) {
    return investorsRegistry.isInvestorAllowed(_from, singleLicenseName) &&
           investorsRegistry.isInvestorAllowed(_spender, singleLicenseName);
  }

  function isApprovedSpendingAllowed(address _from, address _spender, uint _value) constant returns (bool) {
    return investorsRegistry.isInvestorAllowed(_from, singleLicenseName) &&
           investorsRegistry.isInvestorAllowed(_spender, singleLicenseName);
  }

  function isTransferFromAllowed(address _spender, address _from, address _to, uint _value) constant returns (bool) {
    return investorsRegistry.isInvestorAllowed(_from, singleLicenseName) &&
           investorsRegistry.isInvestorAllowed(_spender, singleLicenseName) &&
           investorsRegistry.isInvestorAllowed(_to, singleLicenseName);
  }
}
