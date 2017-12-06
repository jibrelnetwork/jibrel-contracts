/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


/**
 * @title CrydrControllerBlockableInterface interface
 * @dev Interface of a contract that allows block/unlock accounts
 */
contract CrydrControllerBlockableInterface {

  /* blocking/unlocking */

  function blockAccount(address _account);
  function unblockAccount(address _account);

  function blockAccountFunds(address _account, uint256 _value);
  function unblockAccountFunds(address _account, uint256 _value);
}
