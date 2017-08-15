/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


contract CrydrViewERC20LoggableInterface {

  /* Actions */

  function emitTransferEvent(address _from, address _to, uint _value);
  function emitApprovalEvent(address _owner, address _spender, uint _value);
}
