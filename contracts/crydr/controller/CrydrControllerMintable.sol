/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import './CrydrControllerBase.sol';
import './CrydrControllerMintableInterface.sol';


/**
 * @title CrydrControllerMintable interface
 * @dev Implementation of a contract that allows minting/burning of tokens
 */
contract CrydrControllerMintable is CrydrControllerBase, CrydrControllerMintableInterface {

  /* Constructor */

  function CrydrControllerMintable(uint _uniqueId) CrydrControllerBase(_uniqueId) {}


  /* minting/burning */

  function mint(
    address _account, uint _value
  )
    onlyValidMintingAddress(_account)
    onlyValidCrydrStorageAddress(address(crydrStorage))
    onlyAllowedManager('mint_crydr')
  {
    require(_value > 0);

    crydrStorage.increaseBalance(_account, _value);
  }

  function burn(
    address _account, uint _value
  )
    onlyValidMintingAddress(_account)
    onlyValidCrydrStorageAddress(address(crydrStorage))
    onlyAllowedManager('burn_crydr')
  {
    require(_value > 0);

    crydrStorage.decreaseBalance(_account, _value);
  }


  /* Helpers */

  modifier onlyValidMintingAddress(address _account) {
    require(_account != address(0x0));
    _;
  }
}
