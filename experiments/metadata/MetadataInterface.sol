/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


/**
 * @title MetadataInterface
 * @dev   Interface of the contract that is able to store arbitrary metadata strings
 */
contract MetadataInterface {
  function setMetadata(string _key, string _value) external;
  function getMetadata(string _key) external constant returns (string);
  function getMetadataHash(string _key) external constant returns (bytes32);
}
