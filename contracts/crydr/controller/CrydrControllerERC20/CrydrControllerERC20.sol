/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../../lifecycle/Pausable/PausableInterface.sol';
import '../CrydrControllerBase/CrydrControllerBase.sol';
import './CrydrControllerERC20Interface.sol';

import '../../storage/CrydrStorageBalance/CrydrStorageBalanceInterface.sol';
import '../../storage/CrydrStorageAllowance/CrydrStorageAllowanceInterface.sol';
import '../../storage/CrydrStorageERC20/CrydrStorageERC20Interface.sol';
import '../../view/CrydrViewERC20Loggable/CrydrViewERC20LoggableInterface.sol';


/**
 * @title CrydrControllerERC20Interface interface
 * @dev Interface of a contract that implement business-logic of an ERC20 CryDR
 */
contract CrydrControllerERC20 is CrydrControllerBase {

  /* ERC20 support. _msgsender - account that invoked CrydrView */

  function transfer(
    address _msgsender,
    address _to,
    uint256 _value
  )
    public
    onlyCrydrView
    whenContractNotPaused
  {
    CrydrStorageERC20Interface(getCrydrStorageAddress()).transfer(_msgsender, _to, _value);

    if (isCrydrViewRegistered('erc20') == true) {
      CrydrViewERC20LoggableInterface(getCrydrViewAddress('erc20')).emitTransferEvent(_msgsender, _to, _value);
    }
  }

  function getTotalSupply() public view returns (uint256) {
    return CrydrStorageBalanceInterface(getCrydrStorageAddress()).getTotalSupply();
  }

  function getBalance(address _owner) public view returns (uint256) {
    return CrydrStorageBalanceInterface(getCrydrStorageAddress()).getBalance(_owner);
  }

  function approve(
    address _msgsender,
    address _spender,
    uint256 _value
  )
    public
    onlyCrydrView
    whenContractNotPaused
  {
    // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
    // https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    // We decided to enforce users to set 0 before set new value
    uint256 allowance = CrydrStorageAllowanceInterface(getCrydrStorageAddress()).getAllowance(_msgsender, _spender);
    require((allowance > 0 && _value == 0) || (allowance == 0 && _value > 0));

    CrydrStorageERC20Interface(getCrydrStorageAddress()).approve(_msgsender, _spender, _value);

    if (isCrydrViewRegistered('erc20') == true) {
      CrydrViewERC20LoggableInterface(getCrydrViewAddress('erc20')).emitApprovalEvent(_msgsender, _spender, _value);
    }
  }

  function transferFrom(
    address _msgsender,
    address _from,
    address _to,
    uint256 _value
  )
    public
    onlyCrydrView
    whenContractNotPaused
  {
    CrydrStorageERC20Interface(getCrydrStorageAddress()).transferFrom(_msgsender, _from, _to, _value);

    if (isCrydrViewRegistered('erc20') == true) {
      CrydrViewERC20LoggableInterface(getCrydrViewAddress('erc20')).emitTransferEvent(_from, _to, _value);
    }
  }

  function getAllowance(address _owner, address _spender) public view returns (uint256 ) {
    return CrydrStorageAllowanceInterface(getCrydrStorageAddress()).getAllowance(_owner, _spender);
  }
}
