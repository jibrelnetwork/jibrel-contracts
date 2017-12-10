/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../util/CommonModifiers.sol';
import '../lifecycle/Ownable.sol';
import '../lifecycle/Manageable.sol';
import '../lifecycle/Pausable.sol';
import '../crydr/jnt/JNTPayableService.sol';


contract JNTPayableServiceMock is CommonModifiers,
                                  Ownable,
                                  Manageable,
                                  Pausable,
                                  JNTPayableService { }
