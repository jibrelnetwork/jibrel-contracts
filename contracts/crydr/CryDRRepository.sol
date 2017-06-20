pragma solidity ^0.4.11;


/* Author: Victor Mezrin  victor@mezrin.com */


import "../solidity-stringutils/strings.sol";
import "../utils/Manageable.sol";
import "../token/NamedToken.sol";


/**
 * @title CryDRRepositoryInterface
 * @dev   Interface of the contract that stores list of tokens
 */
contract CryDRRepositoryInterface {

  /* Libs */

  using strings for *;


  /* Events */

  event CryDRAddedEvent(address indexed CryDRAddress, string indexed CryDRName, string indexed CryDRSymbol);
  event CryDRRemovedEvent(address indexed CryDRAddress, string indexed CryDRName, string indexed CryDRSymbol);


  /* Public functions */

  /**
   * @dev Function to find address of the CryDR token by the symbol
   * @param _CryDRSymbol string CryDR symbol
   * @return Address of the CryDR
   */
  function lookupCryDR(string _CryDRSymbol) constant returns (address _CryDRAddress);

  /**
   * @dev Function returns data about all known CryDR in JSON format
   * @dev Assumed that this function called only from the web interface via .call() notation, gas usage is huge :)
   * @dev Return value: array of objects with fields "address", "name", "symbol"
   * @return JSON with listed CryDR
   */
  function getCryDRData() constant returns (string _CryDRData);
}


/**
 * @title CryDRRepository
 * @dev   Stores list of tokens
 */
contract CryDRRepository is CryDRRepositoryInterface, Manageable {

  /* Data structures */

  struct CryDRInfo {
    address crydrAddress;
    string crydrName;
    string crydrSymbol;
  }


  /* Storage */

  mapping (bytes32 => address) crydrLookup; // symbol -> address, to perform fast lookup by name
  CryDRInfo[] public crydrInfo; // stores info about all listed CryDRs
  uint256 public crydrNumber = 0;


  /**
   * @dev Function to add new CryDR
   * @param _CryDRAddress address Address of the deployed token
   * @param _CryDRName    string  CryDR name
   * @param _CryDRSymbol  string  CryDR symbol
   */
  function addCryDR(address _CryDRAddress, string _CryDRName, string _CryDRSymbol) onlyManager('add_crydr') {
    if (_CryDRAddress == 0x0 || bytes(_CryDRName).length == 0 || bytes(_CryDRSymbol).length == 0) {
      throw;
    }
    var _nameHash = sha3(_CryDRName);
    var _symbolHash = sha3(_CryDRSymbol);
    var _token = NamedToken(_CryDRAddress);
    if (_nameHash != _token.getNameHash() || _symbolHash != _token.getSymbolHash()) {
      throw;
    }
    if (crydrLookup[_symbolHash] != 0x0) {
      throw;
    }

    crydrLookup[_symbolHash] = _CryDRAddress;

    crydrInfo.length += 1;
    crydrNumber += 1;
    var _newCrydrId = crydrNumber - 1;
    crydrInfo[_newCrydrId].crydrAddress = _CryDRAddress;
    crydrInfo[_newCrydrId].crydrName = _CryDRName;
    crydrInfo[_newCrydrId].crydrSymbol = _CryDRSymbol;

    CryDRAddedEvent(_CryDRAddress, _CryDRName, _CryDRSymbol);
  }

  /**
   * @dev Function to remove CryDR
   * @param _CryDRAddress address Address of the deployed token
   * @param _CryDRName    string  CryDR name
   * @param _CryDRSymbol  string  CryDR symbol
   */
  function removeCryDR(address _CryDRAddress, string _CryDRName, string _CryDRSymbol) onlyManager('remove_crydr') {
    if (_CryDRAddress == 0x0 || bytes(_CryDRName).length == 0 || bytes(_CryDRSymbol).length == 0) {
      throw;
    }
    var _nameHash = sha3(_CryDRName);
    var _symbolHash = sha3(_CryDRSymbol);
    var _token = NamedToken(_CryDRAddress);
    if (_nameHash != _token.getNameHash() || _symbolHash != _token.getSymbolHash()) {
      throw;
    }
    if (crydrLookup[_symbolHash] == 0x0) {
      throw;
    }

    crydrLookup[_symbolHash] = 0x0;

    bool _isDeleted = false;
    for (uint i = 0; i < crydrNumber; i++) {
      if (
        crydrInfo[i].crydrAddress == _CryDRAddress &&
        sha3(crydrInfo[i].crydrName) == sha3(_CryDRName) &&
        sha3(crydrInfo[i].crydrSymbol) == sha3(_CryDRSymbol)
      ) {
        for (uint z = i; z < crydrNumber - 1; z++) {
          crydrInfo[z] = crydrInfo[z + 1];
        }
        _isDeleted = true;
        break;
      }
    }
    crydrNumber -= 1;
    if (_isDeleted == false) {
      throw;
    }

    CryDRRemovedEvent(_CryDRAddress, _CryDRName, _CryDRSymbol);
  }

  function lookupCryDR(string _CryDRSymbol) constant returns (address _CryDRAddress){
    if (bytes(_CryDRSymbol).length == 0) {
      throw;
    }
    var _symbolHash = sha3(_CryDRSymbol);
    if (crydrLookup[_symbolHash] == 0x0) {
      throw;
    }
    return crydrLookup[_symbolHash];
  }

  function getCryDRData() constant returns (string _CryDRData) {
    _CryDRData = '[';
    for (uint i = 0; i < crydrNumber; i++) {
      if (i != 0) {
        _CryDRData = concat(_CryDRData, ',');
      }
      _CryDRData = concat(_CryDRData, '{"address": "0x');
      _CryDRData = concat(_CryDRData, addressToAsciiString(crydrInfo[i].crydrAddress));
      _CryDRData = concat(_CryDRData, '", "name": "');
      _CryDRData = concat(_CryDRData, crydrInfo[i].crydrName);
      _CryDRData = concat(_CryDRData, '", "symbol": "');
      _CryDRData = concat(_CryDRData, crydrInfo[i].crydrSymbol);
      _CryDRData = concat(_CryDRData, '"}');
    }
    _CryDRData = concat(_CryDRData, ']');
  }

  function concat(string s1, string s2) internal returns (string){
    return s1.toSlice().concat(s2.toSlice());
  }

  function addressToAsciiString(address x) internal returns (string) {
    bytes memory s = new bytes(40);
    for (uint i = 0; i < 20; i++) {
        byte b = byte(uint8(uint(x) / (2**(8*(19 - i)))));
        byte hi = byte(uint8(b) / 16);
        byte lo = byte(uint8(b) - 16 * uint8(hi));
        s[2*i] = byteToChar(hi);
        s[2*i+1] = byteToChar(lo);
    }
    return string(s);
  }

  function byteToChar(byte b) internal returns (byte c) {
      if (b < 10) return byte(uint8(b) + 0x30);
      else return byte(uint8(b) + 0x57);
  }
}
