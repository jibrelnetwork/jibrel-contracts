/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


/**
 * @title CrydrControllerBaseInterface interface
 * @dev Interface of a contract that implement business-logic of an CryDR, mediates CryDR views and storage
 */
contract CrydrControllerBaseInterface {

  /* Events */

  event CrydrStorageChangedEvent(address indexed crydrstorage);
  event CrydrViewAddedEvent(string standardname, address indexed crydrview);
  event CrydrViewRemovedEvent(string standardname, address indexed crydrview);


  /* Configuration */

  function setCrydrStorage(address _newStorage);
  function getCrydrStorage() constant returns (address);

  function setCrydrView(string _viewApiStandardName, address _newCrydrView);
  function removeCrydrView(string _viewApiStandardName);
  function getCrydrView(string _viewApiStandard) constant returns (address);
}
