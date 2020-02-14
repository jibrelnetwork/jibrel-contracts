/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity >=0.4.0 <0.6.0;


/**
 * @title AssetIDInterface
 * @dev Interface of a contract that assigned to an asset (JNT, JUSD etc.)
 * @dev Contracts for the same asset (like JNT, JUSD etc.) will have the same AssetID.
 * @dev This will help to avoid misconfiguration of contracts
 */
contract AssetIDInterface {
  function getAssetID() public view returns (string memory);
  function getAssetIDHash() public view returns (bytes32);
}
