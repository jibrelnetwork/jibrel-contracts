/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import './CrydrControllerBase.sol';
import './CrydrControllerMintableInterface.sol';


/**
 * @title CrydrControllerMintable interface
 * @dev Implementation of a contract that allows minting/burning of tokens
 */
contract CrydrControllerMintable is CrydrControllerBase, CrydrControllerMintableInterface {

  /* minting/burning */

  function mint(
    address _account, uint _value
  )
    onlyContractAddress(address(crydrStorage))
    onlyAllowedManager('mint_crydr')
  {
    // input parameters checked by the storage

    crydrStorage.increaseBalance(_account, _value);
  }

  function burn(
    address _account, uint _value
  )
    onlyContractAddress(address(crydrStorage))
    onlyAllowedManager('burn_crydr')
  {
    // input parameters checked by the storage

    crydrStorage.decreaseBalance(_account, _value);
  }
}
