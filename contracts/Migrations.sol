pragma solidity ^0.4.15;

contract Migrations {
  address owner;
  uint256 last_completed_migration;

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function Migrations() {
    owner = msg.sender;
  }

  function setCompleted(uint256 completed) restricted {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }

  function getOwner() constant returns (address) {
    return owner;
  }

  function getLastCompletedMigration() constant returns (uint256) {
    return last_completed_migration;
  }
}
