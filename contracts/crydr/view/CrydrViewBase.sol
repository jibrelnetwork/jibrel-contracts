/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import '../../lifecycle/Pausable.sol';
import "../../util/CommonModifiers.sol";
import "../../feature/bytecode/BytecodeExecutable.sol";
import "../../feature/assetid/AssetIDInterface.sol";
import "../../feature/assetid/AssetID.sol";
import './CrydrViewBaseInterface.sol';


contract CrydrViewBase is CrydrViewBaseInterface,
                          Pausable,
                          CommonModifiers,
                          BytecodeExecutable,
                          AssetID {

  /* Storage */

  address crydrController;
  string crydrViewStandardName;


  /* Constructor */

  function CrydrViewBase(
    string _assetID,
    string _standardName
  )
    AssetID(_assetID)
    onlyValidStandardName(_standardName)
  {
    crydrViewStandardName = _standardName;
  }


  /* CrydrViewBaseInterface */

  function setCrydrController(
    address _crydrController
  ) external
    onlyContractAddress(_crydrController)
    onlyAllowedManager('set_crydr_controller')
    whenContractPaused
  {
    require(crydrController != _crydrController);

    crydrController = _crydrController;
    CrydrControllerChangedEvent(_crydrController);
  }

  function getCrydrController() external constant returns (address) {
    return crydrController;
  }


  function getCrydrViewStandardName() external constant returns (string) {
    return crydrViewStandardName;
  }

  function getCrydrViewStandardNameHash() external constant returns (bytes32) {
    return sha3(crydrViewStandardName);
  }


  /* Pausable */

  /**
   * @dev Override method to ensure that contract properly configured before it is unpaused
   */
  function unpauseContract() {
    require(isContract(crydrController) == true);
    require(AssetID.getAssetIDHash() == AssetIDInterface(crydrController).getAssetIDHash());

    Pausable.unpauseContract();
  }


  /* Helpers */

  modifier onlyValidStandardName(string _standardName) {
    require(bytes(_standardName).length > 0);
    _;
  }

  modifier onlyCrydrController() {
    require(msg.sender == crydrController);
    _;
  }
}
