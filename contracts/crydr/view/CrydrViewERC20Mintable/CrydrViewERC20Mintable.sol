/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


import '../../../lifecycle/Pausable/PausableInterface.sol';
import '../CrydrViewBase/CrydrViewBase.sol';
import './CrydrViewERC20MintableInterface.sol';


contract CrydrViewERC20Mintable is
                                   CrydrViewBase,
                                   CrydrViewERC20MintableInterface {

  function emitMintEvent(
    address _owner,
    uint256 _value
  )
    external
  {
    require(msg.sender == getCrydrController());

    emit MintEvent(_owner, _value);
  }

  function emitBurnEvent(
    address _owner,
    uint256 _value
  )
    external
  {
    require(msg.sender == getCrydrController());

    emit BurnEvent(_owner, _value);
  }
}
