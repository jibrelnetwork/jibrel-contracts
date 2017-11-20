/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


contract CrydrViewBaseInterface {

  /* Events */

  event CrydrControllerChangedEvent(address indexed crydrcontroller);


  /* Configuration */

  function setCrydrController(address _crydrController) external;
  function getCrydrController() external constant returns (address);

  function getCrydrViewStandardName() external constant returns (string);
  function getCrydrViewStandardNameHash() external constant returns (bytes32);
}
