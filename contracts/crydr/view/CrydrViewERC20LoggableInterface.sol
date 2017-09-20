/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


contract CrydrViewERC20LoggableInterface {

  /* Actions */

  function emitTransferEvent(address _from, address _to, uint _value) external;
  function emitApprovalEvent(address _owner, address _spender, uint _value) external;
}
