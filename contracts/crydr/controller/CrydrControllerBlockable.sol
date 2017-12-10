/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.18;


import '../../lifecycle/ManageableInterface.sol';
import './CrydrControllerBaseInterface.sol';
import './CrydrControllerBlockableInterface.sol';

import '../storage/CrydrStorageBaseInterface.sol';


/**
 * @title CrydrControllerBlockable interface
 * @dev Implementation of a contract that allows blocking/unlocking accounts
 */
contract CrydrControllerBlockable is ManageableInterface,
                                     CrydrControllerBaseInterface,
                                     CrydrControllerBlockableInterface {


  /* blocking/unlocking */

  function blockAccount(
    address _account
  )
    public
    onlyAllowedManager('block_account')
  {
    CrydrStorageBaseInterface(getCrydrStorageAddress()).blockAccount(_account);
  }

  function unblockAccount(
    address _account
  )
    public
    onlyAllowedManager('unblock_account')
  {
    CrydrStorageBaseInterface(getCrydrStorageAddress()).unblockAccount(_account);
  }

  function blockAccountFunds(
    address _account,
    uint256 _value
  )
    public
    onlyAllowedManager('block_account_funds')
  {
    CrydrStorageBaseInterface(getCrydrStorageAddress()).blockAccountFunds(_account, _value);
  }

  function unblockAccountFunds(
    address _account,
    uint256 _value
  )
    public
    onlyAllowedManager('unblock_account_funds')
  {
    CrydrStorageBaseInterface(getCrydrStorageAddress()).unblockAccountFunds(_account, _value);
  }
}
