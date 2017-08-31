/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


import "./CryDRRegistryInterface.sol";


/**
 * @title CryDRRegistryManagementInterface
 * @dev   Interface of the contract that stores list of CryDRs and is configurable
 */
contract CryDRRegistryManagementInterface is CryDRRegistryInterface {

  /* Events */

  event CryDRControllerChangedEvent(string crydrsymbol, string crydrname, address indexed crydrcontroller);


  /* Public functions */

  /**
   * @dev Function to add new CryDR
   * @param _crydrSymbol     string  CryDR symbol
   * @param _crydrName       string  CryDR name
   * @param _crydrController address  CryDR controller address
   */
  function addCrydr(string _crydrSymbol, string _crydrName, address _crydrController);

  /**
   * @dev Function to remove CryDR
   * @param _crydrSymbol     string  CryDR symbol
   * @param _crydrName       string  CryDR name
   * @param _crydrController address  CryDR controller address
   */
  function removeCrydr(string _crydrSymbol, string _crydrName, address _crydrController);
}
