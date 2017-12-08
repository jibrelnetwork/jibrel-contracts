/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../lifecycle/Pausable.sol';
import '../../util/CommonModifiers.sol';
import '../../feature/bytecode/BytecodeExecutable.sol';
import '../../feature/assetid/AssetIDInterface.sol';
import '../../feature/assetid/AssetID.sol';
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
    public
    AssetID(_assetID)
    onlyValidStandardName(_standardName)
  {
    crydrViewStandardName = _standardName;
  }


  /* CrydrViewBaseInterface */

  function setCrydrController(
    address _crydrController
  )
    external
    onlyContractAddress(_crydrController)
    onlyAllowedManager('set_crydr_controller')
    whenContractPaused
  {
    require(crydrController != _crydrController);

    crydrController = _crydrController;
    CrydrControllerChangedEvent(_crydrController);
  }

  function getCrydrController() public constant returns (address) {
    return crydrController;
  }


  function getCrydrViewStandardName() public constant returns (string) {
    return crydrViewStandardName;
  }

  function getCrydrViewStandardNameHash() public constant returns (bytes32) {
    return keccak256(crydrViewStandardName);
  }


  /* Pausable */

  /**
   * @dev Override method to ensure that contract properly configured before it is unpaused
   */
  function unpauseContract() public {
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
