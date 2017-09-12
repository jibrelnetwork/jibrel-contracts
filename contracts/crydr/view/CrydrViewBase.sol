/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


import '../../lifecycle/Pausable.sol';
import '../controller/CrydrControllerBaseInterface.sol';
import './CrydrViewBaseInterface.sol';


contract CrydrViewBase is CrydrViewBaseInterface, Pausable {

  /* Storage */

  CrydrControllerBaseInterface crydrController;
  string crydrViewStandardName;


  /* Constructor */

  function CrydrViewBase(string _standardName) onlyValidStandardName(_standardName) {
    crydrViewStandardName = _standardName;
  }


  /* CrydrViewBaseInterface */

  function setCrydrController(
    address _crydrController
  ) external
    onlyValidCrydrControllerAddress(_crydrController)
    onlyAllowedManager('set_crydr_controller')
    whenContractPaused
  {
    require(address(crydrController) != _crydrController);

    crydrController = CrydrControllerBaseInterface(_crydrController);
    CrydrControllerChangedEvent(_crydrController);
  }

  function getCrydrController() external constant returns (address controllerAddress) {
    return address(crydrController);
  }


  function getCrydrViewStandardName() external constant returns (string) {
    return crydrViewStandardName;
  }

  function getCrydrViewStandardNameHash() external constant returns (bytes32) {
    return sha3(crydrViewStandardName);
  }


  /* Pausable */

  /**
   * @dev Override method to ensure that contract properly configured before it is unpaused
   */
  function unpause()
    onlyValidCrydrControllerAddress(address(crydrController))
  {
    super.unpauseContract();
  }


  /* Helpers */

  modifier onlyValidStandardName(string _standardName) {
    require(bytes(_standardName).length > 0);
    _;
  }

  modifier onlyValidCrydrControllerAddress(address _controllerAddress) {
    require(_controllerAddress != address(0x0));
    // todo check that this is contract address
    _;
  }

  modifier onlyCrydrController() {
    require(msg.sender == address(crydrController));
    _;
  }
}
