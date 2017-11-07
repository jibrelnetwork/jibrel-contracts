/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


/**
 * @title CrydrERC20ValidatableMock
 * @dev This contract used only to test contracts
 */
contract CrydrERC20ValidatableMock {

  /* CrydrERC20ValidatableInterface */

  function isReceivingAllowed(address _account, uint _value) constant returns (bool)
  {
    return true;
  }

  function isSpendingAllowed(address _account, uint _value) constant returns (bool)
  {
    return true;
  }

  function isTransferAllowed(address _from, address _to, uint _value) constant returns (bool)
  {
    return true;
  }

  function isApproveAllowed(address _from, address _spender, uint _value) constant returns (bool)
  {
    return true;
  }

  function isApprovedSpendingAllowed(address _from, address _spender, uint _value) constant returns (bool)
  {
    return true;
  }

  function isTransferFromAllowed(address _spender, address _from, address _to, uint _value) constant returns (bool)
  {
    return true;
  }
}