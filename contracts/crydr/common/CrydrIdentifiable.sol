/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


/**
 * @title CrydrIdentifiable
 * @dev Base contract implementing uniqueness.
 */
contract CrydrIdentifiable {

  /* Storage */

  uint uniqueId;


  /* Constructor */

  function CrydrIdentifiable(uint _uniqueId) {
    uniqueId = _uniqueId;
  }


  /* Getters */

  function getUniqueId() constant returns (uint) {
    return uniqueId;
  }
}
