/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;

import '../lifecycle/Ownable.sol';
import '../lifecycle/Manageable.sol';
import '../lifecycle/Pausable.sol';


/**
 * @title PausableMock
 * @dev This contract used only to test modifiers of Pausable contract
 */
contract PausableMockV1 is Ownable, Manageable, Pausable { }
