pragma solidity ^0.4.18;


import "../third-party/zeppelin-solidity/SafeMath.sol";


contract SafeMathMock is SafeMath {
  uint256 public result;

  function multiply(uint256 a, uint256 b) public {
    result = SafeMath.safeMul(a, b);
  }

  function subtract(uint256 a, uint256 b) public {
    result = SafeMath.safeSub(a, b);
  }

  function add(uint256 a, uint256 b) public {
    result = SafeMath.safeAdd(a, b);
  }
}
