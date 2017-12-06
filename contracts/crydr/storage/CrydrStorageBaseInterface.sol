/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


/**
 * @title CrydrStorageBaseInterface interface
 * @dev Interface of a contract that manages balance of an CryDR
 */
contract CrydrStorageBaseInterface {

  /* Events */

  event CrydrControllerChangedEvent(address indexed crydrcontroller);
  event AccountBalanceIncreasedEvent(address indexed account, uint256 value);
  event AccountBalanceDecreasedEvent(address indexed account, uint256 value);
  event AccountAllowanceIncreasedEvent(address indexed owner, address indexed spender, uint256 value);
  event AccountAllowanceDecreasedEvent(address indexed owner, address indexed spender, uint256 value);
  event AccountBlockedEvent(address indexed account);
  event AccountUnblockedEvent(address indexed account);
  event AccountFundsBlockedEvent(address indexed account, uint256 value);
  event AccountFundsUnblockedEvent(address indexed account, uint256 value);


  /* Configuration */

  function setCrydrController(address _newController) external;
  function getCrydrController() public constant returns (address);


  /* Low-level change of balance. Implied that totalSupply kept in sync. */

  function increaseBalance(address _account, uint256 _value) external;
  function decreaseBalance(address _account, uint256 _value) external;
  function getBalance(address _account) public constant returns (uint256);
  function getTotalSupply() public constant returns (uint256);


  /* Low-level change of allowance */

  function increaseAllowance(address _owner, address _spender, uint256 _value) external;
  function decreaseAllowance(address _owner, address _spender, uint256 _value) external;
  function getAllowance(address _owner, address _spender) public constant returns (uint256);


  /* Low-level change of blocks and getters */

  function blockAccount(address _account) external;
  function unblockAccount(address _account) external;
  function getAccountBlocks(address _account) public constant returns (uint256);

  function blockAccountFunds(address _account, uint256 _value) external;
  function unblockAccountFunds(address _account, uint256 _value) external;
  function getAccountBlockedFunds(address _account) public constant returns (uint256);
}
