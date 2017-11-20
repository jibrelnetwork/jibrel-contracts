/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import '../../lifecycle/Pausable.sol';
import "../../util/CommonModifiers.sol";
import "../../feature/bytecode/BytecodeExecutable.sol";
import '../controller/CrydrControllerBaseInterface.sol';
import './CrydrViewBaseInterface.sol';
import "../common/CrydrIdentifiable.sol";
import "../common/CrydrIdentifiableInterface.sol";


contract CrydrViewBase is CrydrViewBaseInterface,
                          Pausable,
                          CommonModifiers,
                          BytecodeExecutable,
                          CrydrIdentifiable {

  /* Storage */

  CrydrControllerBaseInterface crydrController;
  string crydrViewStandardName;


  /* Constructor */

  function CrydrViewBase(
    string _standardName,
    uint _uniqueId
  )
    CrydrIdentifiable(_uniqueId)
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
    require(address(crydrController) != _crydrController);

    crydrController = CrydrControllerBaseInterface(_crydrController);
    CrydrControllerChangedEvent(_crydrController);
  }

  function getCrydrController() external constant returns (address controllerAddress) {
    return address(crydrController);
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
    require(isContract(address(crydrController)) == true);
    require(CrydrIdentifiable.getUniqueId() == CrydrIdentifiableInterface(crydrController).getUniqueId());

    Pausable.unpauseContract();
  }


  /* Helpers */

  modifier onlyValidStandardName(string _standardName) {
    require(bytes(_standardName).length > 0);
    _;
  }

  modifier onlyCrydrController() {
    require(msg.sender == address(crydrController));
    _;
  }
}
