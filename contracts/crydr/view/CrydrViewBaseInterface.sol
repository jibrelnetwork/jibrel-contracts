/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


contract CrydrViewBaseInterface {

  /* Events */

  event CrydrControllerChangedEvent(address indexed crydrcontroller);


  /* Configuration */

  function setCrydrController(address _crydrController);
  function getCrydrController() constant returns (address);

  function getCrydrViewStandardName() constant returns (string);
  function getCrydrViewStandardNameHash() constant returns (bytes32);
}
