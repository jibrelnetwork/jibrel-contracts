/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.13;


/**
 * @title CrydrControllerBlockableInterface interface
 * @dev Interface of a contract that allows block/unlock accounts
 */
contract CrydrControllerBlockableInterface {

  /* blocking/unlocking */

  function blockAccount(address _account);
  function blockFunds(address _account, uint _value);
  function unlockAccount(address _account);
  function unlockFunds(address _account, uint _value);
}
