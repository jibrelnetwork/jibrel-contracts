/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


/**
 * @title CrydrERC20ValidatableInterface interface
 * @dev Interface of a contract that allows to check validity of transaction (in terms of licensing only)
 * @dev Methods do not sufficiency of funds to perform transactions, they check only required licenses
 */
contract CrydrERC20ValidatableInterface {

  /*
   * Getters
   * If _value == 0, methods do not take this parameter into account at all
  */

  function isReceivingAllowed(address _account, uint _value) constant returns (bool);
  function isSpendingAllowed(address _account, uint _value) constant returns (bool);

  function isTransferAllowed(address _from, address _to, uint _value) constant returns (bool);

  function isApproveAllowed(address _from, address _spender, uint _value) constant returns (bool);
  function isApprovedSpendingAllowed(address _from, address _spender, uint _value) constant returns (bool);
  function isTransferFromAllowed(address _spender, address _from, address _to, uint _value) constant returns (bool);
}
