/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../../lifecycle/Manageable/ManageableInterface.sol';
import '../../../lifecycle/Pausable/PausableInterface.sol';
import '../CrydrControllerBase/CrydrControllerBaseInterface.sol';
import './CrydrControllerMintableInterface.sol';

import '../../storage/CrydrStorageBalance/CrydrStorageBalanceInterface.sol';
import '../../view/CrydrViewERC20Mintable/CrydrViewERC20MintableInterface.sol';
import '../../view/CrydrViewERC20Loggable/CrydrViewERC20LoggableInterface.sol';


/**
 * @title CrydrControllerMintable interface
 * @dev Implementation of a contract that allows minting/burning of tokens
 * @dev We do not use events Transfer(0x0, owner, amount) for minting as described in the EIP20
 * @dev because that are not transfers
 */
contract CrydrControllerMintable is ManageableInterface,
                                    PausableInterface,
                                    CrydrControllerBaseInterface,
                                    CrydrControllerMintableInterface {

  /* minting/burning */

  function mint(
    address _account, uint256 _value
  )
    public
    whenContractNotPaused
    onlyAllowedManager('mint_crydr')
  {
    // input parameters checked by the storage

    CrydrStorageBalanceInterface(getCrydrStorageAddress()).increaseBalance(_account, _value);

    if (isCrydrViewRegistered('erc20') == true) {
      CrydrViewERC20MintableInterface(getCrydrViewAddress('erc20')).emitMintEvent(_account, _value);
      CrydrViewERC20LoggableInterface(getCrydrViewAddress('erc20')).emitTransferEvent(address(0x0), _account, _value);
    }
  }

  function burn(
    address _account, uint256 _value
  )
    public
    whenContractNotPaused
    onlyAllowedManager('burn_crydr')
  {
    // input parameters checked by the storage

    CrydrStorageBalanceInterface(getCrydrStorageAddress()).decreaseBalance(_account, _value);

    if (isCrydrViewRegistered('erc20') == true) {
      CrydrViewERC20MintableInterface(getCrydrViewAddress('erc20')).emitBurnEvent(_account, _value);
      CrydrViewERC20LoggableInterface(getCrydrViewAddress('erc20')).emitTransferEvent(_account, address(0x0), _value);
    }
  }
}
