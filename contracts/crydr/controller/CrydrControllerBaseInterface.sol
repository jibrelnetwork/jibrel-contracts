/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


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

  // todo add name and symbol, check views and storage during unpause

  function setCrydrStorage(address _newStorage) external;
  function getCrydrStorage() external constant returns (address);

  function setCrydrView(string _viewApiStandardName, address _newCrydrView) external;
  function removeCrydrView(string _viewApiStandardName) external;
  function getCrydrView(string _viewApiStandard) external constant returns (address);

  function getCrydrViewsNumber() external constant returns (uint);
  function getCrydrViewByNumber(uint _viewId) external constant returns (address);
}
