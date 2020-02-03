/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../../util/CommonModifiers/CommonModifiersInterface.sol';
import '../../../feature/AssetID/AssetIDInterface.sol';
import '../../../lifecycle/Manageable/ManageableInterface.sol';
import '../../../lifecycle/Pausable/PausableInterface.sol';
import './CrydrStorageBaseInterface.sol';


/**
 * @title CrydrStorageBase
 */
contract CrydrStorageBase is CommonModifiersInterface,
                             AssetIDInterface,
                             ManageableInterface,
                             PausableInterface,
                             CrydrStorageBaseInterface {

  /* Storage */

  address crydrController = address(0x0);


  /* CrydrStorageBaseInterface */

  /* Configuration */

  function setCrydrController(
    address _crydrController
  )
    public
    whenContractPaused
    onlyContractAddress(_crydrController)
    onlyAllowedManager('set_crydr_controller')
  {
    require(_crydrController != address(crydrController));
    require(_crydrController != address(this));

    crydrController = _crydrController;

    emit CrydrControllerChangedEvent(_crydrController);
  }

  function getCrydrController() public view returns (address) {
    return address(crydrController);
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
