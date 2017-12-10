pragma solidity ^0.4.18;


/**
 * @title SafeMathInterface
 * @dev Math operations with safety checks that throw on error
 */
contract SafeMathInterface {
  function safeMul(uint256 a, uint256 b) internal pure returns (uint256);
  function safeDiv(uint256 a, uint256 b) internal pure returns (uint256);
  function safeSub(uint256 a, uint256 b) internal pure returns (uint256);
  function safeAdd(uint256 a, uint256 b) internal pure returns (uint256);
}
