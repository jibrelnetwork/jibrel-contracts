/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity >=0.4.0 <0.6.0;


/**
 * @title CrydrControllerBlockableInterface interface
 * @dev Interface of a contract that allows block/unlock accounts
 */
contract CrydrControllerBlockableInterface {

  /* blocking/unlocking */

  function blockAccount(address _account) public;
  function unblockAccount(address _account) public;

  function blockAccountFunds(address _account, uint256 _value) public;
  function unblockAccountFunds(address _account, uint256 _value) public;
}
