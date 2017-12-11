/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


/**
 * @title CrydrStorageBaseInterface interface
 * @dev Interface of a contract that manages balance of an CryDR
 */
contract CrydrStorageBaseInterface {

  /* Events */

  event CrydrControllerChangedEvent(address indexed crydrcontroller);


  /* Configuration */

  function setCrydrController(address _newController) public;
  function getCrydrController() public constant returns (address);
}
