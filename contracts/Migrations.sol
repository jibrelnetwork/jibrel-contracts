pragma solidity ^0.4.18;

contract Migrations {
  address owner;
  uint256 last_completed_migration;

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function Migrations() public {
    owner = msg.sender;
  }

  function setCompleted(uint256 completed) public restricted {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }

  function getOwner() public constant returns (address) {
    return owner;
  }

  function getLastCompletedMigration() public constant returns (uint256) {
    return last_completed_migration;
  }
}
