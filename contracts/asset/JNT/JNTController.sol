/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/storage/CrydrStorageERC20Interface.sol";
import "../../crydr/view/ERC20LoggableInterface.sol";
import "../../crydr/controller/CrydrControllerBase.sol";
import "../../crydr/controller/CrydrControllerBlockable.sol";
import "../../crydr/controller/CrydrControllerMintable.sol";
import "../../crydr/controller/CrydrControllerERC20.sol";
import "../../crydr/jnt/JNTControllerInterface.sol";


/**
 * @title JNTController
 * @dev Mediates views and storage of JNT, provides additional methods for Jibrel contracts
 */
contract JNTController is CrydrControllerBase,
                          CrydrControllerBlockable,
                          CrydrControllerMintable,
                          CrydrControllerERC20,
                          JNTControllerInterface {

  /* Constructor */

  function JNTController() CrydrControllerBase('JNT') {}


  /* JNTControllerInterface */

  function chargeJNT(address _from, address _to, uint _value) onlyAllowedManager('jnt_payable_service') {
    CrydrStorageERC20Interface(address(crydrStorage)).transfer(_from, _to, _value);
    JNTChargedEvent(msg.sender, _from, _to, _value);
  }
}
