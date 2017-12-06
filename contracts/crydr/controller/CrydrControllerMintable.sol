/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import './CrydrControllerBase.sol';
import './CrydrControllerMintableInterface.sol';
import "../view/ERC20MintableInterface.sol";


/**
 * @title CrydrControllerMintable interface
 * @dev Implementation of a contract that allows minting/burning of tokens
 * @dev We do not use events Transfer(0x0, owner, amount) for minting as described in the EIP20
 * @dev because that are not transfers
 */
contract CrydrControllerMintable is CrydrControllerBase, CrydrControllerMintableInterface {

  /* minting/burning */

  function mint(
    address _account, uint _value
  )
    whenContractNotPaused
    onlyAllowedManager('mint_crydr')
  {
    // input parameters checked by the storage

    crydrStorage.increaseBalance(_account, _value);

    if (crydrViewsAddresses['erc20'] != 0x0) {
        ERC20MintableInterface(crydrViewsAddresses['erc20']).emitMintEvent(_account, _value);
    }
  }

  function burn(
    address _account, uint _value
  )
    whenContractNotPaused
    onlyAllowedManager('burn_crydr')
  {
    // input parameters checked by the storage

    crydrStorage.decreaseBalance(_account, _value);

    if (crydrViewsAddresses['erc20'] != 0x0) {
        ERC20MintableInterface(crydrViewsAddresses['erc20']).emitBurnEvent(_account, _value);
    }
  }
}
