/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


import "../../solidity-stringutils/strings.sol";
import "../../lifecycle/Manageable.sol";
import "../../crydr/view/ERC20Named.sol";


/**
 * @title CryDRRegistryInterface
 * @dev   Interface of the contract that stores list of CryDRs
 */
contract CryDRRegistryInterface {

  /* Events */

  event CryDRAddedEvent(string crydrsymbol, string crydrname, address indexed crydrcontroller);
  event CryDRRemovedEvent(string crydrsymbol, string crydrname, address indexed crydrcontroller);


  /* Public functions */

  /**
   * @dev Function to find address of the CryDR by the symbol
   * @param _crydrSymbol     string CryDR symbol
   * @param _viewApiStandard string Name of standard of the CryDR view
   * @return Address of the CryDR view
   */
  function lookupCrydrView(string _crydrSymbol, string _viewApiStandard) constant returns (address);

  /**
   * @dev Function returns data about all known CryDR in JSON format
   * @dev Assumed that this function called only from the web interface via .call() notation, gas usage is huge :)
   * @dev Return value - array of objects:
   * @dev   {"symbol": "..", "name": "..", "views": [{"apistandard": "..", "address": "0x00"}]}
   * @dev This method allows greatly reduce amount of calls from web UI to the blockchain
   * @dev IMPORTANT This is a kind of experiment and can be changed at any time
   * @return JSON with listed CryDR
   */
  function getCryDRData() constant returns (string);
}
