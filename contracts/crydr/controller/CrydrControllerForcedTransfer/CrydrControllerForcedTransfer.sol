/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../../lifecycle/Manageable/ManageableInterface.sol';
import '../../../lifecycle/Pausable/PausableInterface.sol';
import '../CrydrControllerBase/CrydrControllerBaseInterface.sol';
import './CrydrControllerForcedTransferInterface.sol';

import '../../storage/CrydrStorageBalance/CrydrStorageBalanceInterface.sol';
import '../../view/CrydrViewERC20Loggable/CrydrViewERC20LoggableInterface.sol';


/**
 * @title CrydrControllerForcedTransfer
 * @dev Implementation of a contract that allows manager to transfer funds from one account to another
 */
contract CrydrControllerForcedTransfer is ManageableInterface,
                                          PausableInterface,
                                          CrydrControllerBaseInterface,
                                          CrydrControllerForcedTransferInterface {

  /* minting/burning */

  function forcedTransfer(
    address _from, address _to, uint256 _value
  )
    public
    whenContractNotPaused
    onlyAllowedManager('forced_transfer')
  {
    // input parameters checked by the storage

    CrydrStorageBalanceInterface(getCrydrStorageAddress()).decreaseBalance(_from, _value);
    CrydrStorageBalanceInterface(getCrydrStorageAddress()).increaseBalance(_to, _value);

    emit ForcedTransferEvent(_from, _to, _value);
    if (isCrydrViewRegistered('erc20') == true) {
      CrydrViewERC20LoggableInterface(getCrydrViewAddress('erc20')).emitTransferEvent(_from, _to, _value);
    }
  }

  function forcedTransferAll(
    address _from, address _to
  )
    public
    whenContractNotPaused
    onlyAllowedManager('forced_transfer')
  {
    // input parameters checked by the storage

    uint256 value = CrydrStorageBalanceInterface(getCrydrStorageAddress()).getBalance(_from);
    CrydrStorageBalanceInterface(getCrydrStorageAddress()).decreaseBalance(_from, value);
    CrydrStorageBalanceInterface(getCrydrStorageAddress()).increaseBalance(_to, value);

    emit ForcedTransferEvent(_from, _to, value);
    if (isCrydrViewRegistered('erc20') == true) {
      CrydrViewERC20LoggableInterface(getCrydrViewAddress('erc20')).emitTransferEvent(_from, _to, value);
    }
  }
}
