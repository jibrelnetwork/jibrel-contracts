/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


/**
 * @title CrydrControllerBaseInterface interface
 * @dev Interface of a contract that implement business-logic of an CryDR, mediates CryDR views and storage
 */
contract CrydrControllerBaseInterface {

  /* Events */

  event CrydrStorageChangedEvent(address indexed crydrstorage);
  event CrydrViewAddedEvent(address indexed crydrview, bytes32 standardname);
  event CrydrViewRemovedEvent(address indexed crydrview, bytes32 standardname);


  /* Configuration */

  function setCrydrStorage(address _newStorage) external;
  function getCrydrStorageAddress() public view returns (address);

  function setCrydrView(address _newCrydrView, string  calldata _viewApiStandardName) external;
  function removeCrydrView(string calldata _viewApiStandardName) external;
  function getCrydrViewAddress(string memory _viewApiStandardName) public view returns (address);

  function isCrydrViewAddress(address _crydrViewAddress) public view returns (bool);
  function isCrydrViewRegistered(string memory _viewApiStandardName) public view returns (bool);


  /* Helpers */

  modifier onlyValidCrydrViewStandardName(string memory _viewApiStandard) {
    require(bytes(_viewApiStandard).length > 0);
    _;
  }

  modifier onlyCrydrView() {
    require(isCrydrViewAddress(msg.sender) == true);
    _;
  }
}
