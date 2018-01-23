/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


/**
 * @title PausableInterface
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 * @dev Based on zeppelin's Pausable, but integrated with Manageable
 * @dev Contract is in paused state by default and should be explicitly unlocked
 */
contract PausableInterface {

  /**
   * Events
   */

  event PauseEvent();
  event UnpauseEvent();


  /**
   * @dev called by the manager to pause, triggers stopped state
   */
  function pauseContract() public;

  /**
   * @dev called by the manager to unpause, returns to normal state
   */
  function unpauseContract() public;

  /**
   * @dev The getter for "paused" contract variable
   */
  function getPaused() public constant returns (bool);
}
