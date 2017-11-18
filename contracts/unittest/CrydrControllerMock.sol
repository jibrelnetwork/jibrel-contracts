/* Author: Aleksey Selikhov  aleksey.selikhov@mgmail.com */

pragma solidity ^0.4.15;


import "../crydr/storage/CrydrStorageBaseInterface.sol";
import "../crydr/storage/CrydrStorageERC20Interface.sol";
import "../crydr/common/CrydrIdentifiable.sol";


/**
 * @title CrydrControllerMock
 * @dev This contract used only to test functions of CrydrStorage contract
 */
contract CrydrControllerMock is CrydrIdentifiable {

  /* Storage */

  address crydrStorage;

  function CrydrControllerMock(
    address _crydrStorage,
    uint _uniqueId
  )
    CrydrIdentifiable(_uniqueId)
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

  function unlockAccount(address _account)
  {
    CrydrStorageBaseInterface(crydrStorage).unlockAccount(_account);
  }

  function blockFunds(address _account, uint _value)
  {
    CrydrStorageBaseInterface(crydrStorage).blockFunds(_account, _value);
  }

  function unlockFunds(address _account, uint _value)
  {
    CrydrStorageBaseInterface(crydrStorage).unlockFunds(_account, _value);
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
