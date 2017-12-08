/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.18;


/**
 * @title AssetIDInterface
 * @dev Interface of a contract that assigned to an asset (JNT, jUSD etc.)
 * @dev Contracts for the same asset (like JNT, jUSD etc.) will have the same AssetID.
 * @dev This will help to avoid misconfiguration of contracts
 */
contract AssetIDInterface {
  function getAssetID() public constant returns (string);
  function getAssetIDHash() public constant returns (bytes32);
}
