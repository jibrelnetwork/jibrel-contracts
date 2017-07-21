/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.11;


contract CrydrViewBaseInterface {

  /* Events */

  event CrydrStorageChangedEvent(address indexed crydrstorage);
  event CrydrControllerChangedEvent(address indexed crydrcontroller);


  /* Configuration */

  function setCrydrStorage(address _crydrStorage); // todo try to remove this in order to implement true model-view-controller
  function getCrydrStorage() constant returns (address);

  function setCrydrController(address _crydrController);
  function getCrydrController() constant returns (address);

  function getCrydrViewStandardName() constant returns (string);
  function getCrydrViewStandardNameHash() constant returns (bytes32);
}
