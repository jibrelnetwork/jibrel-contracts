/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


import './CrydrControllerBase.sol';
import './CrydrControllerBlockableInterface.sol';


/**
 * @title CrydrControllerBlockable interface
 * @dev Implementation of a contract that allows blocking/unlocking accounts
 */
contract CrydrControllerBlockable is CrydrControllerBase, CrydrControllerBlockableInterface {


  /* blocking/unlocking */

  function blockAccount(
    address _account
  )
    onlyAllowedManager('block_account')
  {
    crydrStorage.blockAccount(_account);
  }

  function unblockAccount(
    address _account
  )
    onlyAllowedManager('unblock_account')
  {
    crydrStorage.unblockAccount(_account);
  }

  function blockAccountFunds(
    address _account,
    uint _value
  )
    onlyAllowedManager('block_account_funds')
  {
    crydrStorage.blockAccountFunds(_account, _value);
  }

  function unblockAccountFunds(
    address _account,
    uint _value
  )
    onlyAllowedManager('unblock_account_funds')
  {
    crydrStorage.unblockAccountFunds(_account, _value);
  }
}
