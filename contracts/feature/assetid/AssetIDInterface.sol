/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


/**
 * @title AssetIDInterface
 * @dev Interface of a contract that assigned to an asset (JNT, jUSD etc.)
 * @dev Contracts for the same asset (like JNT, jUSD etc.) will have the same AssetID.
 * @dev This will help to avoid misconfiguration of contracts
 */
contract AssetIDInterface {
  function getAssetID() constant returns (string);
  function getAssetIDHash() constant returns (bytes32);
}
