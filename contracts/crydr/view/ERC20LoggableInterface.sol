/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


/**
 * @title ERC20LoggableInterface
 * @dev Contract is able to create Transfer/Approval events with the cal from controller
 */
contract ERC20LoggableInterface {

  function emitTransferEvent(address _from, address _to, uint256 _value) external;
  function emitApprovalEvent(address _owner, address _spender, uint256 _value) external;
}
