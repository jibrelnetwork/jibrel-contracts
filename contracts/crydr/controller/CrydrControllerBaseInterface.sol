/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


/**
 * @title CrydrControllerBaseInterface interface
 * @dev Interface of a contract that implement business-logic of an CryDR, mediates CryDR views and storage
 */
contract CrydrControllerBaseInterface {

  /* Events */

  event CrydrStorageChangedEvent(address indexed crydrstorage);
  event CrydrViewAddedEvent(address indexed crydrview, string standardname);
  event CrydrViewRemovedEvent(address indexed crydrview, string standardname);


  /* Configuration */

  function setCrydrStorage(address _newStorage);
  function getCrydrStorage() constant returns (address);

  function setCrydrView(address _newCrydrView, string _viewApiStandardName);
  function removeCrydrView(string _viewApiStandardName);
  function getCrydrView(string _viewApiStandard) constant returns (address);
}
