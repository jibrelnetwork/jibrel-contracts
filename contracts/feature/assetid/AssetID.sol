/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.24;


import './AssetIDInterface.sol';


/**
 * @title AssetID
 * @dev Base contract implementing AssetIDInterface
 */
contract AssetID is AssetIDInterface {

  /* Storage */

  string assetID;


  /* Constructor */

  constructor (string _assetID) public {
    require(bytes(_assetID).length > 0);

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
