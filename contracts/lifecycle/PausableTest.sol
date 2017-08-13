/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


import "./Pausable.sol";


/**
 * @title PausableTest
 * @dev This contract used only to test modifiers of Pausable contract
 */
contract PausableTest is Pausable {

  uint public counter = 0;

  function workswhenContractNotPaused() whenContractNotPaused {
    counter += 1;
  }

  function workswhenContractPaused() whenContractPaused {
    counter += 1;
  }
}
