/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../third-party/zeppelin-solidity/SafeMathInterface.sol';
import '../../lifecycle/PausableInterface.sol';
import './CrydrStorageBaseInterface.sol';
import './CrydrStorageBalanceInterface.sol';
import './CrydrStorageAllowanceInterface.sol';
import './CrydrStorageBlocksInterface.sol';
import './CrydrStorageERC20Interface.sol';


/**
 * @title CrydrStorageERC20
 */
contract CrydrStorageERC20 is SafeMathInterface,
                              PausableInterface,
                              CrydrStorageBaseInterface,
                              CrydrStorageBalanceInterface,
                              CrydrStorageAllowanceInterface,
                              CrydrStorageBlocksInterface,
                              CrydrStorageERC20Interface {

  function transfer(
    address _msgsender,
    address _to,
    uint256 _value
  )
    public
    whenContractNotPaused
  {
    require(msg.sender == getCrydrController());

    require(_msgsender != _to);
    require(getAccountBlocks(_msgsender) == 0);
    require(safeSub(getBalance(_msgsender), _value) >= getAccountBlockedFunds(_msgsender));

    decreaseBalance(_msgsender, _value);
    increaseBalance(_to, _value);
    CrydrTransferredEvent(_msgsender, _to, _value);
  }

  function transferFrom(
    address _msgsender,
    address _from,
    address _to,
    uint256 _value
  )
    public
    whenContractNotPaused
  {
    require(msg.sender == getCrydrController());

    require(getAccountBlocks(_msgsender) == 0);
    require(getAccountBlocks(_from) == 0);
    require(safeSub(getBalance(_from), _value) >= getAccountBlockedFunds(_from));
    require(_from != _to);

    decreaseAllowance(_from, _msgsender, _value);
    decreaseBalance(_from, _value);
    increaseBalance(_to, _value);
    CrydrTransferredFromEvent(_msgsender, _from, _to, _value);
  }

  function approve(
    address _msgsender,
    address _spender,
    uint256 _value
  )
    public
    whenContractNotPaused
  {
    require(msg.sender == getCrydrController());

    require(getAccountBlocks(_msgsender) == 0);
    require(getAccountBlocks(_spender) == 0);

    uint256 currentAllowance = getAllowance(_msgsender, _spender);
    require(currentAllowance != _value);
    if (currentAllowance > _value) {
      decreaseAllowance(_msgsender, _spender, safeSub(currentAllowance, _value));
    } else {
      increaseAllowance(_msgsender, _spender, safeSub(_value, currentAllowance));
    }

    CrydrSpendingApprovedEvent(_msgsender, _spender, _value);
  }
}
