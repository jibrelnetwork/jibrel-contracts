/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.24;


/**
 * @title CrydrERC20ValidatableMock
 * @dev This contract used only to test contracts
 */
contract CrydrERC20ValidatableMock {

  /* CrydrERC20ValidatableInterface */

  function isReceivingAllowed(address _account, uint256 _value) public constant returns (bool)
  {
    return true;
  }

  function isSpendingAllowed(address _account, uint256 _value) public constant returns (bool)
  {
    return true;
  }

  function isTransferAllowed(address _from, address _to, uint256 _value) public constant returns (bool)
  {
    return true;
  }

  function isApproveAllowed(address _from, address _spender, uint256 _value) public constant returns (bool)
  {
    return true;
  }

  function isApprovedSpendingAllowed(address _from, address _spender, uint256 _value) public constant returns (bool)
  {
    return true;
  }

  function isTransferFromAllowed(address _spender, address _from, address _to, uint256 _value) public constant returns (bool)
  {
    return true;
  }
}
