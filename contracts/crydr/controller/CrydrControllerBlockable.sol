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
    onlyValidAccountAddress(_account)
    onlyAllowedManager('block_account')
  {
    crydrStorage.blockAccount(_account);
  }

  function unblockAccount(
    address _account
  )
    onlyValidAccountAddress(_account)
    onlyAllowedManager('unlock_account')
  {
    crydrStorage.unblockAccount(_account);
  }

  function blockAccountFunds(
    address _account,
    uint _value
  )
    onlyValidAccountAddress(_account)
    onlyAllowedManager('block_funds')
  {
    require(_value > 0);

    crydrStorage.blockAccountFunds(_account, _value);
  }

  function unblockAccountFunds(
    address _account,
    uint _value
  )
    onlyValidAccountAddress(_account)
    onlyAllowedManager('unlock_funds')
  {
    require(_value > 0);

    crydrStorage.unblockAccountFunds(_account, _value);
  }

  /* Helpers */

  modifier onlyValidAccountAddress(address _account) {
    require(_account != address(0x0));
    _;
  }
}
