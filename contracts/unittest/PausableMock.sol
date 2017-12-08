/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../lifecycle/Pausable.sol';


/**
 * @title PausableMock
 * @dev This contract used only to test modifiers of Pausable contract
 */
contract PausableMock is Pausable {

  event WhenContractNotPausedEvent();
  event WhenContractPausedEvent();

  uint256 public counter = 0;

  function worksWhenContractNotPaused() public whenContractNotPaused {
    counter += 1;
    WhenContractNotPausedEvent();
  }

  function worksWhenContractPaused() public whenContractPaused {
    counter += 10;
    WhenContractPausedEvent();
  }
}
