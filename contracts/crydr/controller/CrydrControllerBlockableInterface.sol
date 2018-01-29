/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.18;


/**
 * @title CrydrControllerBlockableInterface interface
 * @dev Interface of a contract that allows block/unlock accounts
 */
interface CrydrControllerBlockableInterface {

  /* blocking/unlocking */

  function blockAccount(address _account) public;
  function unblockAccount(address _account) public;

  function blockAccountFunds(address _account, uint256 _value) public;
  function unblockAccountFunds(address _account, uint256 _value) public;
}
