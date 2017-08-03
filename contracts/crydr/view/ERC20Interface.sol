/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


/**
 * @title ERC20Interface
 * @dev ERC20 interface to use in applications
 */
contract ERC20Interface {
  event Transfer(address indexed from, address indexed to, uint value);
  event Approval(address indexed owner, address indexed spender, uint value);

  function transfer(address _to, uint _value) returns (bool success);
  function totalSupply() constant returns (uint);
  function balanceOf(address _owner) constant returns (uint balance);

  function approve(address _spender, uint _value) returns (bool success);
  function transferFrom(address _from, address _to, uint _value) returns (bool success);
  function allowance(address _owner, address _spender) constant returns (uint remaining);
}
