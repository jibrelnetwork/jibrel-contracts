/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../lifecycle/Pausable.sol';
import '../../util/CommonModifiers.sol';
import '../../feature/assetid/AssetID.sol';
import './CrydrStorageBaseInterface.sol';


/**
 * @title CrydrStorageBase
 */
contract CrydrStorageBase is Pausable,
                             CommonModifiers,
                             AssetID,
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
    CrydrControllerChangedEvent(_crydrController);
  }

  function getCrydrController() public constant returns (address) {
    return address(crydrController);
  }


  /* PausableInterface */

  /**
   * @dev Override method to ensure that contract properly configured before it is unpaused
   */
  function unpauseContract() public {
    require(isContract(crydrController) == true);
    require(getAssetIDHash() == AssetIDInterface(crydrController).getAssetIDHash());

    super.unpauseContract();
  }
}
