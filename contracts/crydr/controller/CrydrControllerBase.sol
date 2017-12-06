/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../lifecycle/Pausable.sol";
import "../../util/CommonModifiers.sol";
import "../../feature/bytecode/BytecodeExecutable.sol";
import "../../feature/assetid/AssetID.sol";
import "../storage/CrydrStorageBaseInterface.sol";
import "../view/CrydrViewBaseInterface.sol";
import "./CrydrControllerBaseInterface.sol";


/**
 * @title CrydrControllerBase
 * @dev Implementation of a contract with business-logic of an CryDR, mediates CryDR views and storage
 */
contract CrydrControllerBase is CrydrControllerBaseInterface,
                                Pausable,
                                CommonModifiers,
                                BytecodeExecutable,
                                AssetID {

  /* Storage */

  CrydrStorageBaseInterface crydrStorage;
  mapping (string => address) crydrViewsAddresses;
  mapping (address => bool) isRegisteredView;


  /* Constructor */

  function CrydrControllerBase(string _assetID) AssetID(_assetID) public {}


  /* CrydrControllerBaseInterface */

  function setCrydrStorage(
    address _crydrStorage
  )
    external
    onlyContractAddress(_crydrStorage)
    onlyAllowedManager('set_crydr_storage')
    whenContractPaused
  {
    require(_crydrStorage != address(this));
    require(_crydrStorage != address(crydrStorage));

    crydrStorage = CrydrStorageBaseInterface(_crydrStorage);
    CrydrStorageChangedEvent(_crydrStorage);
  }

  function getCrydrStorage() public constant returns (address) {
    return address(crydrStorage);
  }


  function setCrydrView(
    address _newCrydrView, string _viewApiStandardName
  )
    external
    onlyContractAddress(_newCrydrView)
    onlyValidCrydrViewStandardName(_viewApiStandardName)
    onlyAllowedManager('set_crydr_view')
    whenContractPaused
  {
    require(_newCrydrView != address(this));
    require(crydrViewsAddresses[_viewApiStandardName] == address(0x0));

    var crydrViewInstance = CrydrViewBaseInterface(_newCrydrView);
    var standardNameHash = crydrViewInstance.getCrydrViewStandardNameHash();
    require(standardNameHash == keccak256(_viewApiStandardName));

    crydrViewsAddresses[_viewApiStandardName] = _newCrydrView;
    isRegisteredView[_newCrydrView] = true;

    CrydrViewAddedEvent(_newCrydrView, _viewApiStandardName);
  }

  function removeCrydrView(
    string _viewApiStandardName
  )
    external
    onlyValidCrydrViewStandardName(_viewApiStandardName)
    onlyAllowedManager('remove_crydr_view')
    whenContractPaused
  {
    require(crydrViewsAddresses[_viewApiStandardName] != address(0x0));

    address removedView = crydrViewsAddresses[_viewApiStandardName];

    // make changes to the storage
    crydrViewsAddresses[_viewApiStandardName] == address(0x0);
    isRegisteredView[removedView] = false;

    CrydrViewRemovedEvent(removedView, _viewApiStandardName);
  }

  function getCrydrView(
    string _viewApiStandardName
  )
    public
    constant
    onlyValidCrydrViewStandardName(_viewApiStandardName)
    returns (address)
  {
    require(crydrViewsAddresses[_viewApiStandardName] != address(0x0));

    return crydrViewsAddresses[_viewApiStandardName];
  }


  /* Helpers */

  modifier onlyValidCrydrViewStandardName(string _viewApiStandard) {
    require(bytes(_viewApiStandard).length > 0);
    _;
  }

  modifier onlyCrydrView() {
    require(isRegisteredView[msg.sender] == true);
    _;
  }
}
