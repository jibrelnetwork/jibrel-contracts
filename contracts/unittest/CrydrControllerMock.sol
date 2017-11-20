/* Author: Aleksey Selikhov  aleksey.selikhov@mgmail.com */

pragma solidity ^0.4.15;


import "../feature/uuid/UUID.sol";
import "../crydr/storage/CrydrStorageBaseInterface.sol";
import "../crydr/storage/CrydrStorageERC20Interface.sol";


/**
 * @title CrydrControllerMock
 * @dev This contract used only to test functions of CrydrStorage contract
 */
contract CrydrControllerMock is UUID {

  /* Storage */

  address crydrStorage;

  function CrydrControllerMock(
    address _crydrStorage,
    uint _uuid
  )
    UUID(_uuid)
  {
    require(_crydrStorage != address(0x0));

    crydrStorage = _crydrStorage;
  }

  function increaseBalance(address _account, uint _value)
  {
    CrydrStorageBaseInterface(crydrStorage).increaseBalance(_account, _value);
  }

  function decreaseBalance(address _account, uint _value)
  {
    CrydrStorageBaseInterface(crydrStorage).decreaseBalance(_account, _value);
  }

  function increaseAllowance(address _owner, address _spender, uint _value)
  {
    CrydrStorageBaseInterface(crydrStorage).increaseAllowance(_owner, _spender, _value);
  }

  function decreaseAllowance(address _owner, address _spender, uint _value)
  {
    CrydrStorageBaseInterface(crydrStorage).decreaseAllowance(_owner, _spender, _value);
  }

  function blockAccount(address _account)
  {
    CrydrStorageBaseInterface(crydrStorage).blockAccount(_account);
  }

  function unblockAccount(address _account)
  {
    CrydrStorageBaseInterface(crydrStorage).unblockAccount(_account);
  }

  function blockAccountFunds(address _account, uint _value)
  {
    CrydrStorageBaseInterface(crydrStorage).blockAccountFunds(_account, _value);
  }

  function unblockAccountFunds(address _account, uint _value)
  {
    CrydrStorageBaseInterface(crydrStorage).unblockAccountFunds(_account, _value);
  }

  function transfer(address _msgsender, address _to, uint _value)
  {
    CrydrStorageERC20Interface(crydrStorage).transfer(_msgsender, _to, _value);
  }

  function transferFrom(address _msgsender, address _from, address _to, uint _value)
  {
    CrydrStorageERC20Interface(crydrStorage).transferFrom(_msgsender, _from, _to, _value);
  }

  function approve(address _msgsender, address _spender, uint _value)
  {
    CrydrStorageERC20Interface(crydrStorage).approve(_msgsender, _spender, _value);
  }
}
