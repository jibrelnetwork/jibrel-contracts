/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../lifecycle/Pausable.sol";


/**
 * @title PausableUnittest
 * @dev This contract used only to test modifiers of Pausable contract
 */
contract PausableUnittest is Pausable {

  event WhenContractNotPausedEvent();
  event WhenContractPausedEvent();

  uint public counter = 0;

  function worksWhenContractNotPaused() whenContractNotPaused {
    counter += 1;
    WhenContractNotPausedEvent();
  }

  function worksWhenContractPaused() whenContractPaused {
    counter += 10;
    WhenContractPausedEvent();
  }
}
