/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;

import '../lifecycle/Ownable/Ownable.sol';
import '../lifecycle/Manageable/Manageable.sol';
import '../lifecycle/Pausable/Pausable.sol';


/**
 * @title PausableMock
 * @dev This contract used only to test modifiers of Pausable contract
 */
contract PausableMockV1 is Ownable, Manageable, Pausable { }
