/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


contract CrydrViewBaseInterface {

  /* Events */

  event CrydrControllerChangedEvent(address indexed crydrcontroller);


  /* Configuration */

  function setCrydrController(address _crydrController) external;
  function getCrydrController() public constant returns (address);

  function getCrydrViewStandardName() public constant returns (string);
  function getCrydrViewStandardNameHash() public constant returns (bytes32);
}
