/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../../third-party/zeppelin-solidity/SafeMathInterface.sol';
import '../../../util/CommonModifiers/CommonModifiersInterface.sol';
import '../../../feature/AssetID/AssetIDInterface.sol';
import '../../../lifecycle/Manageable/ManageableInterface.sol';
import '../../../lifecycle/Pausable/PausableInterface.sol';
import '../CrydrStorageBase/CrydrStorageBaseInterface.sol';
import './CrydrStorageBalanceInterface.sol';


/**
 * @title CrydrStorageBalance
 */
contract CrydrStorageBalance is SafeMathInterface,
                                PausableInterface,
                                CrydrStorageBaseInterface,
                                CrydrStorageBalanceInterface {

  /* Storage */

  mapping (address => uint256) balances;
  uint256 totalSupply = 0;


  /* Low-level change of balance and getters. Implied that totalSupply kept in sync. */

  function increaseBalance(
    address _account,
    uint256 _value
  )
    public
    whenContractNotPaused
  {
    require(msg.sender == getCrydrController());

    require(_account != address(0x0));
    require(_value > 0);

    balances[_account] = safeAdd(balances[_account], _value);
    totalSupply = safeAdd(totalSupply, _value);

    emit AccountBalanceIncreasedEvent(_account, _value);
  }

  function decreaseBalance(
    address _account,
    uint256 _value
  )
    public
    whenContractNotPaused
  {
    require(msg.sender == getCrydrController());

    require(_account != address(0x0));
    require(_value > 0);

    balances[_account] = safeSub(balances[_account], _value);
    totalSupply = safeSub(totalSupply, _value);

    emit AccountBalanceDecreasedEvent(_account, _value);
  }

  function getBalance(address _account) public view returns (uint256) {
    require(_account != address(0x0));

    return balances[_account];
  }

  function getTotalSupply() public view returns (uint256) {
    return totalSupply;
  }
}
