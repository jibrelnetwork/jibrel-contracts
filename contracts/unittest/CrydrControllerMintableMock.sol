/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../crydr/controller/CrydrControllerMintable.sol";


/**
 * @title CrydrControllerMintableMock
 * @dev Contract for unit tests
 */
contract CrydrControllerMintableMock is CrydrControllerMintable {

  /* Constructor */

  function CrydrControllerMintableMock(string _assetID) CrydrControllerBase(_assetID) {}
}
