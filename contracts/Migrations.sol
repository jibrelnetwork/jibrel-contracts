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

  function setCompleted(uint256 _completed) public restricted {
    last_completed_migration = _completed;
  }

  function upgrade(address _newAddress) public restricted {
    Migrations upgraded = Migrations(_newAddress);
    upgraded.setCompleted(last_completed_migration);
  }

  function getOwner() public constant returns (address) {
    return owner;
  }

  function getLastCompletedMigration() public constant returns (uint256) {
    return last_completed_migration;
  }
}
