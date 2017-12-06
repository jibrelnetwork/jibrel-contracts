/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


import "./AssetIDInterface.sol";


/**
 * @title AssetID
 * @dev Base contract implementing AssetIDInterface
 */
contract AssetID is AssetIDInterface {

  /* Storage */

  string assetID;


  /* Constructor */

  function AssetID(string _assetID) public {
    assetID = _assetID;
  }


  /* Getters */

  function getAssetID() public constant returns (string) {
    return assetID;
  }

  function getAssetIDHash() public constant returns (bytes32) {
    return keccak256(assetID);
  }
}
