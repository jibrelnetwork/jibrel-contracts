/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


/**
 * @title CrydrViewERC20Interface
 * @dev ERC20 interface to use in applications
 */
interface CrydrViewERC20Interface {
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);

  function transfer(address _to, uint256 _value) external returns (bool);
  function totalSupply() external constant returns (uint256);
  function balanceOf(address _owner) external constant returns (uint256);

  function approve(address _spender, uint256 _value) external returns (bool);
  function transferFrom(address _from, address _to, uint256 _value) external returns (bool);
  function allowance(address _owner, address _spender) external constant returns (uint256);
}
