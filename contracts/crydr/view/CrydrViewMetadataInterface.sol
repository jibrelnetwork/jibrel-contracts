/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


/**
 * @title CrydrViewMetadataInterface
 * @dev   Interface of the contract that is able to store arbitrary strings
 */
contract CrydrViewMetadataInterface {
  function setMetadata(string _key, string _value) external;
  function getMetadata(string _key) external constant returns (string);
  function getMetadataHash(string _key) external constant returns (bytes32);
}
