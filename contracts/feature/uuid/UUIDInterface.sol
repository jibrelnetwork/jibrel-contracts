/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


/**
 * @title UUIDInterface
 * @dev Interface of a contract that has a UUID
 */
contract UUIDInterface {
  function getUUID() constant returns (uint);
}
