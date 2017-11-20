/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


import "./UUIDInterface.sol";


/**
 * @title UUID
 * @dev Base contract implementing UUID.
 */
contract UUID is UUIDInterface {

  /* Storage */

  uint uuid;


  /* Constructor */

  function UUID(uint _uuid) {
    uuid = _uuid;
  }


  /* Getters */

  function getUUID() constant returns (uint) {
    return uuid;
  }
}
