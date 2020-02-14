/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../../util/CommonModifiers/CommonModifiers.sol';
import '../../../lifecycle/Manageable/Manageable.sol';
import '../../../lifecycle/Pausable/Pausable.sol';
import './CrydrControllerBaseInterface.sol';

import '../../view/CrydrViewBase/CrydrViewBaseInterface.sol';


/**
 * @title CrydrControllerBase
 * @dev Implementation of a contract with business-logic of an CryDR, mediates CryDR views and storage
 */
contract CrydrControllerBase is CommonModifiers,
                                Pausable
                                 {



  /* Storage */

  address crydrStorage = address(0x0);
  mapping (string => address) crydrViewsAddresses;
  mapping (address => bool) isRegisteredView;

  event CrydrStorageChangedEvent(address indexed crydrstorage);
  event CrydrViewAddedEvent(address indexed crydrview, bytes32 standardname);
  event CrydrViewRemovedEvent(address indexed crydrview, bytes32 standardname);


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

    crydrStorage = _crydrStorage;

    emit CrydrStorageChangedEvent(_crydrStorage);
  }

  function getCrydrStorageAddress() public view returns (address) {
    return address(crydrStorage);
  }


  function setCrydrView(
    address _newCrydrView, string calldata _viewApiStandardName
  )
    external
    onlyContractAddress(_newCrydrView)
    onlyValidCrydrViewStandardName(_viewApiStandardName)
    onlyAllowedManager('set_crydr_view')
    whenContractPaused
  {
    require(_newCrydrView != address(this));
    require(crydrViewsAddresses[_viewApiStandardName] == address(0x0));

    CrydrViewBaseInterface crydrViewInstance = CrydrViewBaseInterface(_newCrydrView);
    bytes32 standardNameHash = crydrViewInstance.getCrydrViewStandardNameHash();
    require(standardNameHash == keccak256(abi.encodePacked(_viewApiStandardName)));

    crydrViewsAddresses[_viewApiStandardName] = _newCrydrView;
    isRegisteredView[_newCrydrView] = true;

    emit CrydrViewAddedEvent(_newCrydrView, keccak256(abi.encodePacked(_viewApiStandardName)));
  }

  function removeCrydrView(
    string calldata _viewApiStandardName
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

    emit CrydrViewRemovedEvent(removedView, keccak256(abi.encodePacked(_viewApiStandardName)));
  }

  function getCrydrViewAddress(
    string memory _viewApiStandardName
  )
    public
    view
    onlyValidCrydrViewStandardName(_viewApiStandardName)
    returns (address)
  {
    require(crydrViewsAddresses[_viewApiStandardName] != address(0x0));

    return crydrViewsAddresses[_viewApiStandardName];
  }

  function isCrydrViewAddress(
    address _crydrViewAddress
  )
    public
    view
    returns (bool)
  {
    require(_crydrViewAddress != address(0x0));

    return isRegisteredView[_crydrViewAddress];
  }

  function isCrydrViewRegistered(
    string memory _viewApiStandardName
  )
    public
    view
    onlyValidCrydrViewStandardName(_viewApiStandardName)
    returns (bool)
  {
    return (crydrViewsAddresses[_viewApiStandardName] != address(0x0));
  }

    /* Helpers */

  modifier onlyValidCrydrViewStandardName(string memory _viewApiStandard) {
    require(bytes(_viewApiStandard).length > 0);
    _;
  }

  modifier onlyCrydrView() {
    require(isCrydrViewAddress(msg.sender) == true);
    _;
  }
}
