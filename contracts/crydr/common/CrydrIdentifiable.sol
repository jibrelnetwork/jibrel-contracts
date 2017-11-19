/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


import "./CrydrIdentifiableInterface.sol";


/**
 * @title CrydrIdentifiable
 * @dev Base contract implementing uniqueness.
 */
contract CrydrIdentifiable is CrydrIdentifiableInterface {

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
