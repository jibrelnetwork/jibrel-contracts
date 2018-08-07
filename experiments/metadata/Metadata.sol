/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../../lifecycle/Manageable/ManageableInterface.sol';
import './MetadataInterface.sol';


contract Metadata is ManageableInterface,
                     MetadataInterface {

  /* Storage */

  mapping (bytes32 => string) meta;


  /* MetadataInterface */

  function setMetadata(
    string _key, string _value
  )
    external
    onlyAllowedManager('set_metadata')
  {
    require(bytes(_key).length > 0);
    require(bytes(_value).length > 0);

    meta[keccak256(_key)] = _value;
  }


  function getMetadata(string _key) external constant returns (string) {
    return meta[keccak256(_key)];
  }

  function getMetadataHash(string _key) external constant returns (bytes32) {
    return keccak256(meta[keccak256(_key)]);
  }
}
