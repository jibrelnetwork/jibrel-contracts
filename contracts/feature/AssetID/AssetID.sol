/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity >=0.4.0 <0.6.0;


import './AssetIDInterface.sol';


/**
 * @title AssetID
 * @dev Base contract implementing AssetIDInterface
 */
contract AssetID {

  /* Storage */

  string assetID;


  /* Constructor */

  constructor (string memory _assetID) public {
    require(bytes(_assetID).length > 0);

    assetID = _assetID;
  }


  /* Getters */

  function getAssetID() public view returns (string memory) {
    return assetID;
  }

  function getAssetIDHash() public view returns (bytes32) {
    return keccak256(abi.encodePacked(assetID));
  }
}
