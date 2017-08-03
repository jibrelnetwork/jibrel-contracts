/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


import "./Manageable.sol";


/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 * @dev Based on zeppelin's Pausable, but integrated with Manageable
 * @dev Contract is in paused state by default and should be explicitly unlocked
 */
contract Pausable is Manageable {
  event PauseEvent();
  event UnpauseEvent();

  bool public paused = true;


  /**
   * @dev modifier to allow actions only when the contract IS paused
   */
  modifier whenNotPaused() {
    require(paused == false);
    _;
  }

  /**
   * @dev modifier to allow actions only when the contract IS NOT paused
   */
  modifier whenPaused {
    require(paused == true);
    _;
  }

  /**
   * @dev called by the manager to pause, triggers stopped state
   */
  function pause() onlyAllowedManager('pause_contract') whenNotPaused {
    paused = true;
    PauseEvent();
  }

  /**
   * @dev called by the manager to unpause, returns to normal state
   */
  function unpause() onlyAllowedManager('unpause_contract') whenPaused {
    paused = false;
    UnpauseEvent();
  }
}
