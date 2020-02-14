/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../util/CommonModifiers/CommonModifiers.sol';
import '../lifecycle/Ownable/Ownable.sol';
import '../lifecycle/Manageable/Manageable.sol';
import '../lifecycle/Pausable/Pausable.sol';
import '../crydr/jnt/JNTPayableService/JNTPayableService.sol';


contract JNTPayableServiceMock is JNTPayableService
                                  { }
