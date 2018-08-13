/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.18;


/**
 * @title Erc20Mock
 * @dev Implementation of a contract that can receives ETH, refunds ETH and logs these operations
 */
contract Erc20Mock {

  /* Storage */

  address owner = address(0x0);
  uint256 tokenTotalSupply = 0;
  mapping (address => uint256) balances;


  /* Events */

  event Transfer(address indexed from, address indexed to, uint256 value);
  event MintEvent(address indexed to, uint256 value);


  /* Constructor */

  constructor() public payable {
    owner = msg.sender;
  }


  /* Erc20Interface */

  function transfer(address _to, uint256 _value) external returns (bool) {
    require (_to != address(0x0));
    require (_value > 0);
    require (balances[msg.sender] >= _value);
    require (balances[_to] + _value > balances[_to]);

    balances[msg.sender] -= _value;
    balances[_to] += _value;
    tokenTotalSupply += _value;
    emit Transfer(msg.sender, _to, _value);
  }

  function totalSupply() external constant returns (uint256) {
    return tokenTotalSupply;
  }

  function balanceOf(address _owner) external constant returns (uint256) {
    return balances[_owner];
  }


  /* Mint */

  function mint(address _to, uint256 _value) external {
    require (msg.sender == owner);
    require (_to != address(0x0));
    require (_value > 0);
    require (balances[_to] + _value > balances[_to]);

    balances[_to] += _value;
    tokenTotalSupply += _value;
    emit MintEvent(_to, _value);
  }
}
