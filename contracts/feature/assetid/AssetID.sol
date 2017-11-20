/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


import "./AssetIDInterface.sol";


/**
 * @title AssetID
 * @dev Base contract implementing AssetIDInterface
 */
contract AssetID is AssetIDInterface {

  /* Storage */

  uint assetID;


  /* Constructor */

  function AssetID(uint _assetID) {
    assetID = _assetID;
  }


  /* Getters */

  function getAssetID() constant returns (uint) {
    return assetID;
  }
}
