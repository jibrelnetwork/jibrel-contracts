/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../lifecycle/PausableInterface.sol';
import './CrydrViewBaseInterface.sol';
import './CrydrViewERC20Interface.sol';
import './CrydrViewERC20LoggableInterface.sol';


contract CrydrViewERC20Loggable is PausableInterface,
                                   CrydrViewBaseInterface,
                                   CrydrViewERC20Interface,
                                   CrydrViewERC20LoggableInterface {

  function emitTransferEvent(
    address _from,
    address _to,
    uint256 _value
  )
    external
  {
    require(msg.sender == getCrydrController());

    emit Transfer(_from, _to, _value);
  }

  function emitApprovalEvent(
    address _owner,
    address _spender,
    uint256 _value
  )
    external
  {
    require(msg.sender == getCrydrController());

    emit Approval(_owner, _spender, _value);
  }
}
