/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


import '../../lifecycle/Pausable.sol';
import '../storage/CrydrStorageBaseInterface.sol';
import '../controller/CrydrControllerBaseInterface.sol';
import './CrydrViewBaseInterface.sol';


contract CrydrViewBase is CrydrViewBaseInterface, Pausable {

  /* Storage */

  CrydrStorageBaseInterface crydrStorage;
  CrydrControllerBaseInterface crydrController;
  string crydrViewStandardName;


  /* Constructor */

  function CrydrViewBase(string _standardName) onlyValidStandardName(_standardName) {
    crydrViewStandardName = _standardName;
  }


  /* CrydrViewBaseInterface */

  function setCrydrStorage(
    address _crydrStorage
  )
    onlyValidCrydrStorageAddress(_crydrStorage)
    onlyAllowedManager('set_crydr_storage')
    whenPaused
  {
    require(address(crydrStorage) != _crydrStorage);

    crydrStorage = CrydrStorageBaseInterface(_crydrStorage);
    CrydrStorageChangedEvent(_crydrStorage);
  }

  function getCrydrStorage() constant returns (address) {
    return address(crydrStorage);
  }


  function setCrydrController(
    address _crydrController
  )
    onlyValidCrydrControllerAddress(_crydrController)
    onlyAllowedManager('set_crydr_controller')
    whenPaused
  {
    require(address(crydrController) != _crydrController);

    crydrController = CrydrControllerBaseInterface(_crydrController);
    CrydrControllerChangedEvent(_crydrController);
  }

  function getCrydrController() constant returns (address controllerAddress) {
    return address(crydrController);
  }


  function getCrydrViewStandardName() constant returns (string) {
    return crydrViewStandardName;
  }

  function getCrydrViewStandardNameHash() constant returns (bytes32) {
    return sha3(crydrViewStandardName);
  }


  /* Pausable */

  /**
   * @dev Override method to ensure that contract properly configured before it is unpaused
   */
  function unpause()
    onlyAllowedManager('unpause_contract')  // todo do we need to explicitly repeat modifiers ?
    whenPaused  // todo do we need to explicitly repeat modifiers ?
    onlyValidCrydrStorageAddress(address(crydrStorage))
    onlyValidCrydrControllerAddress(address(crydrController))
  {
    super.unpause();
  }


  /* Helpers */

  modifier onlyValidStandardName(string _standardName) {
    require(bytes(_standardName).length != 0);
    _;
  }

  modifier onlyValidCrydrStorageAddress(address _storageAddress) {
    require(_storageAddress != address(0x0));
    // todo check that this is contract address
    _;
  }

  modifier onlyValidCrydrControllerAddress(address _storageAddress) {
    require(_storageAddress != address(0x0));
    // todo check that this is contract address
    _;
  }

  modifier onlyCrydrController() {
    require(msg.sender == address(crydrController));
    _;
  }
}
