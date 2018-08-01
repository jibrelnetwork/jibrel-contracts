/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../util/CommonModifiersInterface.sol';
import '../../lifecycle/ManageableInterface.sol';
import '../../lifecycle/PausableInterface.sol';
import './CrydrControllerBaseInterface.sol';

import '../view/CrydrViewBaseInterface.sol';


/**
 * @title CrydrControllerBase
 * @dev Implementation of a contract with business-logic of an CryDR, mediates CryDR views and storage
 */
contract CrydrControllerBase is CommonModifiersInterface,
                                ManageableInterface,
                                PausableInterface,
                                CrydrControllerBaseInterface {

  /* Storage */

  address crydrStorage = address(0x0);
  mapping (string => address) crydrViewsAddresses;
  mapping (address => bool) isRegisteredView;


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

  function getCrydrStorageAddress() public constant returns (address) {
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

    CrydrViewBaseInterface crydrViewInstance = CrydrViewBaseInterface(_newCrydrView);
    bytes32 standardNameHash = crydrViewInstance.getCrydrViewStandardNameHash();
    require(standardNameHash == keccak256(_viewApiStandardName));

    crydrViewsAddresses[_viewApiStandardName] = _newCrydrView;
    isRegisteredView[_newCrydrView] = true;

    emit CrydrViewAddedEvent(_newCrydrView, _viewApiStandardName);
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

    emit CrydrViewRemovedEvent(removedView, _viewApiStandardName);
  }

  function getCrydrViewAddress(
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

  function isCrydrViewAddress(
    address _crydrViewAddress
  )
    public
    constant
    returns (bool)
  {
    require(_crydrViewAddress != address(0x0));

    return isRegisteredView[_crydrViewAddress];
  }

  function isCrydrViewRegistered(
    string _viewApiStandardName
  )
    public
    constant
    onlyValidCrydrViewStandardName(_viewApiStandardName)
    returns (bool)
  {
    return (crydrViewsAddresses[_viewApiStandardName] != address(0x0));
  }
}
