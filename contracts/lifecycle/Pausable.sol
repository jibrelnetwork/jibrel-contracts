/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import './Manageable.sol';
import './PausableInterface.sol';


/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 * @dev Based on zeppelin's Pausable, but integrated with Manageable
 * @dev Contract is in paused state by default and should be explicitly unlocked
 */
contract Pausable is Manageable,
                     PausableInterface {

  /**
   * Storage
   */

  bool paused = true;


  /**
   * @dev called by the manager to pause, triggers stopped state
   */
  function pauseContract() public onlyAllowedManager('pause_contract') whenContractNotPaused {
    paused = true;
    PauseEvent();
  }

  /**
   * @dev called by the manager to unpause, returns to normal state
   */
  function unpauseContract() public onlyAllowedManager('unpause_contract') whenContractPaused {
    paused = false;
    UnpauseEvent();
  }

  /**
   * @dev The getter for "paused" contract variable
   */
  function getPaused() public constant returns (bool) {
    return paused;
  }


  /* Helpers */

  /**
   * @dev modifier to allow actions only when the contract IS paused
   */
  modifier whenContractNotPaused() {
    require(getPaused() == false);
    _;
  }

  /**
   * @dev modifier to allow actions only when the contract IS NOT paused
   */
  modifier whenContractPaused {
    require(getPaused() == true);
    _;
  }
}
