/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import './CrydrViewERC20.sol';
import './CrydrViewERC20LoggableInterface.sol';


contract CrydrViewERC20Loggable is CrydrViewERC20,
                                   CrydrViewERC20LoggableInterface {

  function emitTransferEvent(
    address _from,
    address _to,
    uint256 _value
  )
    external
  {
    require(msg.sender == getCrydrController());

    Transfer(_from, _to, _value);
  }

  function emitApprovalEvent(
    address _owner,
    address _spender,
    uint256 _value
  )
    external
  {
    require(msg.sender == getCrydrController());

    Approval(_owner, _spender, _value);
  }
}
