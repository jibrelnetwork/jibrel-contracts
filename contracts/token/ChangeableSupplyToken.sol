pragma solidity ^0.4.11;


/* Author: Victor Mezrin  victor@mezrin.com */


import "../zeppelin/token/StandardToken.sol";

import "../utils/Manageable.sol";


/**
 * @title ChangeableSupplyToken
 * @dev Simple ERC20 Token example with ability to mint/burn tokens
 */
contract ChangeableSupplyToken is StandardToken, Manageable {
  event MintEvent(address indexed to, uint value);
  event BurnEvent(address indexed from, uint value);


  /**
   * @dev Function to mint tokens
   * @param _to     address The address that will receive the minted tokens.
   * @param _amount address The amount of tokens to mint.
   */
  function mint(address _to, uint _amount) onlyManager('mint') {
    ERC20Basic.totalSupply = totalSupply.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    MintEvent(_to, _amount);
  }

  /**
   * @dev Function to burn tokens
   * @param _from   address The address that will loose the minted tokens.
   * @param _amount uint    The amount of tokens to burn.
   * @return A boolean that indicates if the operation was successful.
   */
  function burn(address _from, uint _amount) onlyManager('burn') {
    ERC20Basic.totalSupply = totalSupply.sub(_amount);
    balances[_from] = balances[_from].sub(_amount);
    BurnEvent(_from, _amount);
  }
}
