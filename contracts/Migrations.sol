pragma solidity ^0.4.13;

contract Migrations {
  address owner;
  uint last_completed_migration;

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function Migrations() {
    owner = msg.sender;
  }

  function setCompleted(uint completed) restricted {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }

  function getOwner() public constant returns (address) {
    return owner;
  }

  function getLastCompletedMigration() public constant returns (uint) {
    return last_completed_migration;
  }
}
