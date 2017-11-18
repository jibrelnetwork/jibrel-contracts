/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


/**
 * @title CrydrIdentifiableInterface
 * @dev Interface of a contract implement uniqueness.
 */
contract CrydrIdentifiableInterface {
  function getUniqueId() constant returns (uint);
}
