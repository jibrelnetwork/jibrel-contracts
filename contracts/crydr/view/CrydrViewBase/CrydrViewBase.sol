/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../../util/CommonModifiers/CommonModifiersInterface.sol';
import '../../../feature/AssetID/AssetIDInterface.sol';
import '../../../lifecycle/Manageable/ManageableInterface.sol';
import '../../../lifecycle/Pausable/PausableInterface.sol';
import './../CrydrViewBase/CrydrViewBaseInterface.sol';


contract CrydrViewBase is CommonModifiersInterface,
                          AssetIDInterface,
                          ManageableInterface,
                          PausableInterface,
                          CrydrViewBaseInterface {

  /* Storage */

  address crydrController = address(0x0);
  string crydrViewStandardName = '';


  /* Constructor */

  constructor (string memory _crydrViewStandardName) public {
    require(bytes(_crydrViewStandardName).length > 0);

    crydrViewStandardName = _crydrViewStandardName;
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

    emit CrydrControllerChangedEvent(_crydrController);
  }

  function getCrydrController() public view returns (address) {
    return crydrController;
  }


  function getCrydrViewStandardName() public view returns (string memory) {
    return crydrViewStandardName;
  }

  function getCrydrViewStandardNameHash() public view returns (bytes32) {
    return keccak256(abi.encodePacked(crydrViewStandardName));
  }


  /* PausableInterface */

  /**
   * @dev Override method to ensure that contract properly configured before it is unpaused
   */
  function unpauseContract() public {
    require(isContract(crydrController) == true);
    require(getAssetIDHash() == AssetIDInterface(crydrController).getAssetIDHash());

    PausableInterface.unpauseContract();
  }
}
