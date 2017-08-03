/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


/**
 * @title CrydrView interface for validation of tx
 * @dev Interface of a contract that allows to check validity of transaction (in terms of licensing only)
 */
contract CrydrViewERC20ValidatableInterface{

  /*
   * Getters
   * If _value == 0, methods do not take this parameter into account at all
  */

  function isRegulated() constant returns (bool);

  function isReceivingAllowed(address _account, uint _value) constant returns (bool);
  function isSpendingAllowed(address _account, uint _value) constant returns (bool);

  function isTransferAllowed(address _from, address _to, uint _value) constant returns (bool);

  function isApproveAllowed(address _from, address _spender, uint _value) constant returns (bool);
  function isApprovedSpendingAllowed(address _from, address _spender, uint _value) constant returns (bool);
  function isTransferFromAllowed(address _spender, address _from, address _to, uint _value) constant returns (bool);
}
