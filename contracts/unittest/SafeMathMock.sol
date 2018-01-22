pragma solidity ^0.4.18;


import '../third-party/zeppelin-solidity/SafeMath.sol';


contract SafeMathMock is SafeMath {
  function multiply(uint256 a, uint256 b) public pure returns (uint256) {
    return SafeMath.safeMul(a, b);
  }

  function divide(uint256 a, uint256 b) public pure returns (uint256) {
    return SafeMath.safeDiv(a, b);
  }

  function subtract(uint256 a, uint256 b) public pure returns (uint256) {
    return SafeMath.safeSub(a, b);
  }

  function add(uint256 a, uint256 b) public pure returns (uint256) {
    return SafeMath.safeAdd(a, b);
  }
}
