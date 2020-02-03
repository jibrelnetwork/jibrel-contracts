/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../../third-party/zeppelin-solidity/SafeMathInterface.sol';
import '../../../util/CommonModifiers/CommonModifiersInterface.sol';
import '../../../feature/AssetID/AssetIDInterface.sol';
import '../../../lifecycle/Pausable/PausableInterface.sol';
import '../CrydrStorageBase/CrydrStorageBaseInterface.sol';
import './CrydrStorageBlocksInterface.sol';


/**
 * @title CrydrStorageBlocks
 */
contract CrydrStorageBlocks is SafeMathInterface,
                               PausableInterface,
                               CrydrStorageBaseInterface,
                               CrydrStorageBlocksInterface {

  /* Storage */

  mapping (address => uint256) accountBlocks;
  mapping (address => uint256) accountBlockedFunds;


  /* Constructor */

  constructor () public {
    accountBlocks[address(0x0)] = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
  }


  /* Low-level change of blocks and getters */

  function blockAccount(
    address _account
  )
    public
  {
    require(msg.sender == getCrydrController());

    require(_account != address(0x0));

    accountBlocks[_account] = safeAdd(accountBlocks[_account], 1);

    emit AccountBlockedEvent(_account);
  }

  function unblockAccount(
    address _account
  )
    public
  {
    require(msg.sender == getCrydrController());

    require(_account != address(0x0));

    accountBlocks[_account] = safeSub(accountBlocks[_account], 1);

    emit AccountUnblockedEvent(_account);
  }

  function getAccountBlocks(
    address _account
  )
    public
    view
    returns (uint256)
  {
    require(_account != address(0x0));

    return accountBlocks[_account];
  }

  function blockAccountFunds(
    address _account,
    uint256 _value
  )
    public
  {
    require(msg.sender == getCrydrController());

    require(_account != address(0x0));
    require(_value > 0);

    accountBlockedFunds[_account] = safeAdd(accountBlockedFunds[_account], _value);

    emit AccountFundsBlockedEvent(_account, _value);
  }

  function unblockAccountFunds(
    address _account,
    uint256 _value
  )
    public
  {
    require(msg.sender == getCrydrController());

    require(_account != address(0x0));
    require(_value > 0);

    accountBlockedFunds[_account] = safeSub(accountBlockedFunds[_account], _value);

    emit AccountFundsUnblockedEvent(_account, _value);
  }

  function getAccountBlockedFunds(
    address _account
  )
    public
    view
    returns (uint256)
  {
    require(_account != address(0x0));

    return accountBlockedFunds[_account];
  }
}
