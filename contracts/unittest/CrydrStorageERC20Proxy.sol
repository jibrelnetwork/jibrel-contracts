/* Author: Aleksey Selikhov  aleksey.selikhov@mgmail.com */

pragma solidity ^0.4.18;


import '../feature/assetid/AssetID.sol';
import '../crydr/storage/CrydrStorageBaseInterface.sol';
import '../crydr/storage/CrydrStorageBalanceInterface.sol';
import '../crydr/storage/CrydrStorageAllowanceInterface.sol';
import '../crydr/storage/CrydrStorageBlocksInterface.sol';
import '../crydr/storage/CrydrStorageERC20Interface.sol';


/**
 * @title CrydrStorageERC20Proxy
 * @dev This contract used only to test functions of CrydrStorage contract
 * @dev CrydrStorage allows calls only from CrydrController, which should be a contract,
 * @dev therefore we have to create proxy contract
 */
contract CrydrStorageERC20Proxy is AssetID,
                                   CrydrStorageBaseInterface,
                                   CrydrStorageBalanceInterface,
                                   CrydrStorageAllowanceInterface,
                                   CrydrStorageBlocksInterface,
                                   CrydrStorageERC20Interface {

  /* Storage */

  address crydrStorage;

  function CrydrStorageERC20Proxy(
    string _assetID,
    address _crydrStorage
  )
    public
    AssetID(_assetID)
  {
    require(_crydrStorage != address(0x0));

    crydrStorage = _crydrStorage;
  }

  function setCrydrController(address _newController) public { crydrStorage = _newController; }
  function getCrydrController() public constant returns (address) { return crydrStorage; }


  /* Low-level change of balance. Implied that totalSupply kept in sync. */

  function increaseBalance(address _account, uint256 _value) public
  {
    CrydrStorageBalanceInterface(crydrStorage).increaseBalance(_account, _value);
  }

  function decreaseBalance(address _account, uint256 _value) public
  {
    CrydrStorageBalanceInterface(crydrStorage).decreaseBalance(_account, _value);
  }

  function getBalance(address _account) public constant returns (uint256)
  {
    return CrydrStorageBalanceInterface(crydrStorage).getBalance(_account);
  }

  function getTotalSupply() public constant returns (uint256)
  {
    return CrydrStorageBalanceInterface(crydrStorage).getTotalSupply();
  }


  /* Low-level change of allowance */

  function increaseAllowance(address _owner, address _spender, uint256 _value) public
  {
    CrydrStorageAllowanceInterface(crydrStorage).increaseAllowance(_owner, _spender, _value);
  }

  function decreaseAllowance(address _owner, address _spender, uint256 _value) public
  {
    CrydrStorageAllowanceInterface(crydrStorage).decreaseAllowance(_owner, _spender, _value);
  }

  function getAllowance(address _owner, address _spender) public constant returns (uint256)
  {
    return CrydrStorageAllowanceInterface(crydrStorage).getAllowance(_owner, _spender);
  }


  /* Low-level change of blocks and getters */

  function blockAccount(address _account) public
  {
    CrydrStorageBlocksInterface(crydrStorage).blockAccount(_account);
  }

  function unblockAccount(address _account) public
  {
    CrydrStorageBlocksInterface(crydrStorage).unblockAccount(_account);
  }

  function getAccountBlocks(address _account) public constant returns (uint256)
  {
    return CrydrStorageBlocksInterface(crydrStorage).getAccountBlocks(_account);
  }


  function blockAccountFunds(address _account, uint256 _value) public
  {
    CrydrStorageBlocksInterface(crydrStorage).blockAccountFunds(_account, _value);
  }

  function unblockAccountFunds(address _account, uint256 _value) public
  {
    CrydrStorageBlocksInterface(crydrStorage).unblockAccountFunds(_account, _value);
  }

  function getAccountBlockedFunds(address _account) public constant returns (uint256)
  {
    return CrydrStorageBlocksInterface(crydrStorage).getAccountBlockedFunds(_account);
  }


  /* CrydrStorageERC20Interface */

  function transfer(address _msgsender, address _to, uint256 _value) public
  {
    CrydrStorageERC20Interface(crydrStorage).transfer(_msgsender, _to, _value);
  }

  function transferFrom(address _msgsender, address _from, address _to, uint256 _value) public
  {
    CrydrStorageERC20Interface(crydrStorage).transferFrom(_msgsender, _from, _to, _value);
  }

  function approve(address _msgsender, address _spender, uint256 _value) public
  {
    CrydrStorageERC20Interface(crydrStorage).approve(_msgsender, _spender, _value);
  }
}
