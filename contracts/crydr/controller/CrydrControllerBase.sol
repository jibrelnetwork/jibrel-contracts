/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../lifecycle/Pausable.sol";
import "../storage/CrydrStorageBaseInterface.sol";
import "../view/CrydrViewBaseInterface.sol";
import "./CrydrControllerBaseInterface.sol";
import "../common/CrydrModifiers.sol";
import "../common/CrydrIdentifiable.sol";


/**
 * @title CrydrControllerBase
 * @dev Implementation of a contract with business-logic of an CryDR, mediates CryDR views and storage
 */
contract CrydrControllerBase is CrydrControllerBaseInterface, Pausable, CrydrModifiers, CrydrIdentifiable {

  /* Storage */

  CrydrStorageBaseInterface crydrStorage;
  mapping (string => address) crydrViewsAddresses;

  // optimizations
  address[] crydrViewsAddressesList;
  mapping (address => bool) isRegisteredView;


  /* Constructor */

  function CrydrControllerBase(uint _uniqueId) CrydrIdentifiable(_uniqueId) {}


  /* Selfdestruct */

  /*
   * @dev Clears all the contract's data it frees up space on the blockchain.
   *      The ethers send to manager after selfdestruct call are lost.
   */
  function close() onlyAllowedManager('close_crydr_controller') {
    // todo test it
    selfdestruct(owner);
  }


  /* CrydrControllerInterface */

  /* Configuration */

  function setCrydrStorage(
    address _crydrStorage
  )
    onlyValidCrydrStorageAddress(_crydrStorage)
    onlyDifferentAddress(_crydrStorage)
    onlyAllowedManager('set_crydr_storage')
    whenContractPaused
  {
    require(_crydrStorage != address(crydrStorage));

    crydrStorage = CrydrStorageBaseInterface(_crydrStorage);
    CrydrStorageChangedEvent(_crydrStorage);
  }

  function getCrydrStorage() constant returns (address) {
    return address(crydrStorage);
  }


  function setCrydrView(
    string _viewApiStandardName, address _crydrView
  )
    onlyValidCrydrViewStandardName(_viewApiStandardName)
    onlyValidCrydrViewAddress(_crydrView)
    onlyDifferentAddress(_crydrView)
    onlyAllowedManager('set_crydr_view')
    whenContractPaused
  {
    require(crydrViewsAddresses[_viewApiStandardName] == address(0x0));

    var crydrViewInstance = CrydrViewBaseInterface(_crydrView);
    var standardNameHash = crydrViewInstance.getCrydrViewStandardNameHash();
    require(standardNameHash == sha3(_viewApiStandardName));

    crydrViewsAddresses[_viewApiStandardName] = _crydrView;
    isRegisteredView[_crydrView] = true;
    crydrViewsAddressesList.push(_crydrView);

    CrydrViewAddedEvent(_viewApiStandardName, _crydrView);
  }

  function removeCrydrView(
    string _viewApiStandardName
  )
    onlyValidCrydrViewStandardName(_viewApiStandardName)
    onlyAllowedManager('remove_crydr_view')
    whenContractPaused
  {
    require(crydrViewsAddresses[_viewApiStandardName] != address(0x0));

    address removedView = crydrViewsAddresses[_viewApiStandardName];

    // make changes to the storage
    crydrViewsAddresses[_viewApiStandardName] == address(0x0);
    isRegisteredView[removedView] = false;

    // remove element from the list
    uint index = 0;
    uint i;
    for (i = 0; i < crydrViewsAddressesList.length; i++) {
      if (crydrViewsAddressesList[i] == removedView) {
        index = i;
      }
    }
    for (i = index; i < crydrViewsAddressesList.length - 1; i++){
        crydrViewsAddressesList[i] = crydrViewsAddressesList[i+1];
    }
    delete crydrViewsAddressesList[crydrViewsAddressesList.length - 1];
    crydrViewsAddressesList.length--;

    CrydrViewRemovedEvent(_viewApiStandardName, removedView);
  }

  function getCrydrView(string _viewApiStandardName) constant returns (address) {
    return crydrViewsAddresses[_viewApiStandardName];
  }

  function getCrydrViewsNumber() constant returns (uint) {
    return crydrViewsAddressesList.length;
  }

  function getCrydrViewByNumber(uint _viewId) constant returns (address) {
    return crydrViewsAddressesList[_viewId];
  }


  /* Pausable */

  /**
   * @dev Override method to ensure that contract properly configured before it is unpaused
   */
  function unpauseContract()
    onlyValidCrydrStorageAddress(crydrStorage)
  {
    require(crydrViewsAddressesList.length > 0);

    Pausable.unpauseContract();
  }


  /* Helpers */

  modifier onlyValidCrydrStorageAddress(address _storageAddress) {
    require(isContract(_storageAddress) == true);
    _;
  }

  modifier onlyValidCrydrViewStandardName(string _viewApiStandard) {
    require(bytes(_viewApiStandard).length > 0);
    _;
  }

  modifier onlyValidCrydrViewAddress(address _viewAddress) {
    require(isContract(_viewAddress) == true);
    _;
  }

  modifier onlyDifferentAddress(address _address) {
    require(_address != address(this));
    _;
  }

  modifier onlyCrydrView() {
    require(isRegisteredView[msg.sender] == true);
    _;
  }

  modifier onlyGreaterThanZero(uint _value) {
    require(_value > 0);
    _;
  }
}
