/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../util/JsonEncoder.sol";
import "../../crydr/controller/CrydrControllerBaseInterface.sol";
import "./CryDRRegistryInterface.sol";
import "./CryDRRegistryManagementInterface.sol";
import "../../crydr/common/CrydrModifiers.sol";


/**
 * @title CryDRRegistry
 * @dev   Stores list of tokens
 */
contract CryDRRegistry is CryDRRegistryInterface, CryDRRegistryManagementInterface, Manageable, JsonEncoder, CrydrModifiers {

  /* Libs */

  using strings for *;


  /* Data structures */

  struct CryDRInfo {
    string crydrSymbol;
    string crydrName;
    address crydrController;
  }


  /* Storage */

  mapping (string => address) crydrLookup; // symbol -> controller address, to perform fast lookup by name
  CryDRInfo[] crydrInfoList; // stores info about all listed CryDRs


  /* CryDRRegistryManagementInterface */

  function addCrydr(string _crydrSymbol, string _crydrName, address _crydrController)
    onlyValidCrydrSymbol(_crydrSymbol)
    onlyUnknownCrydrSymbol(_crydrSymbol)
    onlyValidCrydrName(_crydrName)
    onlyContractAddress(_crydrController)
    onlyMatchedSymbolName(_crydrSymbol, _crydrName, _crydrController)
    onlyAllowedManager('add_crydr')
  {
    crydrLookup[_crydrSymbol] = _crydrController;

    crydrInfoList.length += 1;
    var _newCrydrId = crydrInfoList.length - 1;
    crydrInfoList[_newCrydrId].crydrSymbol = _crydrSymbol;
    crydrInfoList[_newCrydrId].crydrName = _crydrName;
    crydrInfoList[_newCrydrId].crydrController = _crydrController;

    CryDRAddedEvent(_crydrSymbol, _crydrName, _crydrController);
  }

  function removeCrydr(
    string _crydrSymbol, string _crydrName, address _crydrController
  )
    onlyValidCrydrSymbol(_crydrSymbol)
    onlyKnownCrydrSymbol(_crydrSymbol)
    onlyValidCrydrName(_crydrName)
    onlyContractAddress(_crydrController)
    onlyAllowedManager('remove_crydr')
  {
    crydrLookup[_crydrSymbol] = address(0x0);

    bool _isDeleted = false;
    for (uint i = 0; i < crydrInfoList.length; i++) {
      if (
        sha3(crydrInfoList[i].crydrSymbol) == sha3(_crydrSymbol) &&
        sha3(crydrInfoList[i].crydrName) == sha3(_crydrName) &&
        crydrInfoList[i].crydrController == _crydrController
      ) {
        for (uint z = i; z < crydrInfoList.length - 1; z++) {
          crydrInfoList[z] = crydrInfoList[z + 1];
        }
        delete crydrInfoList[crydrInfoList.length - 1];
        crydrInfoList.length--;
        _isDeleted = true;
        break;
      }
    }
    assert(_isDeleted == true);

    CryDRRemovedEvent(_crydrSymbol, _crydrName, _crydrController);
  }


  /* CryDRRegistryInterface */

  function lookupCrydrView(
    string _crydrSymbol, string _viewApiStandard
  )
    onlyValidCrydrSymbol(_crydrSymbol)
    onlyValidViewApiStandard(_viewApiStandard)
    constant
    returns (address)
  {
    return CrydrControllerBaseInterface(crydrLookup[_crydrSymbol]).getCrydrView(_viewApiStandard);
  }

  function getCryDRData() constant returns (string) {
    strings.slice[] memory jsonSlices = new strings.slice[](crydrInfoList.length * 2 - 1 + 2);
    jsonSlices[0] = '['.toSlice();
    for (uint i = 0; i < crydrInfoList.length; i++) {
      jsonSlices[i * 2 + 1] = encodeCrydrInfo(i).toSlice();
      if (i < crydrInfoList.length - 1) {
        jsonSlices[i * 2 + 2] = ','.toSlice();
      }
    }
    jsonSlices[jsonSlices.length - 1] = ']'.toSlice();

    return "".toSlice().join(jsonSlices);
  }


  /* JSON methods */

  function encodeCrydrInfo(uint _crydrId) internal constant returns (string) {
    string[7] memory jsonParts = [
      '{"symbol": "',
      crydrInfoList[_crydrId].crydrSymbol,
      '", "name": "',
      crydrInfoList[_crydrId].crydrName,
      '", "views": [{"apistandard": "erc20", "address": "',
      addressToAsciiString(CrydrControllerBaseInterface(crydrInfoList[_crydrId].crydrController).getCrydrView('erc20')),
      '"}]}'
    ];

    strings.slice[] memory jsonSlices = new strings.slice[](jsonParts.length);
    for (uint i = 0; i < jsonParts.length; i += 1) {
      jsonSlices[i] = jsonParts[i].toSlice();
    }
    return "".toSlice().join(jsonSlices);
  }


  /* Helpers */
  // todo move all modifiers to a single contract

  modifier onlyValidCrydrSymbol(string _crydrSymbol) {
    require(bytes(_crydrSymbol).length > 0);
    _;
  }

  modifier onlyUnknownCrydrSymbol(string _crydrSymbol) {
    require(crydrLookup[_crydrSymbol] == address(0x0));
    _;
  }

  modifier onlyKnownCrydrSymbol(string _crydrSymbol) {
    require(crydrLookup[_crydrSymbol] != address(0x0));
    _;
  }

  modifier onlyValidCrydrName(string _crydrName) {
    require(bytes(_crydrName).length > 0);
    _;
  }

  modifier onlyValidViewApiStandard(string _viewApiStandard) {
    require(bytes(_viewApiStandard).length > 0);
    _;
  }

  /**
   * @dev Checks that we crydr controller has the right using the right symbol
   */
  modifier onlyMatchedSymbolName(string _crydrSymbol, string _crydrName, address _crydrController) {
    // check that we add crydr using the right symbol
    // todo rework it, check name and symbol of controller directly
    var _crydrViewAddress = CrydrControllerBaseInterface(_crydrController).getCrydrView('erc20');
    var _crydrNamedView = ERC20NamedInterface(_crydrViewAddress);
    require(sha3(_crydrSymbol) == _crydrNamedView.getSymbolHash());
    require(sha3(_crydrName) == _crydrNamedView.getNameHash());
    _;
  }
}
