/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


contract CrydrViewBaseInterface {

  /* Events */

  event CrydrControllerChangedEvent(address indexed crydrcontroller);


  /* Configuration */

  function setCrydrController(address _crydrController) external;
  function getCrydrController() public view returns (address);

  function getCrydrViewStandardName() public view returns (string memory);
  function getCrydrViewStandardNameHash() public view returns (bytes32);
}
