/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../lifecycle/PausableInterface.sol';
import './CrydrViewBaseInterface.sol';
import './CrydrViewERC20MintableInterface.sol';


contract CrydrViewERC20Mintable is PausableInterface,
                                   CrydrViewBaseInterface,
                                   CrydrViewERC20MintableInterface {

  function emitMintEvent(
    address _owner,
    uint256 _value
  )
    external
  {
    require(msg.sender == getCrydrController());

    MintEvent(_owner, _value);
  }

  function emitBurnEvent(
    address _owner,
    uint256 _value
  )
    external
  {
    require(msg.sender == getCrydrController());

    BurnEvent(_owner, _value);
  }
}
