/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../third-party/zeppelin-solidity/SafeMath.sol";
import "../../lifecycle/Pausable.sol";
import "./CrydrStorageBaseInterface.sol";
import "./CrydrStorageERC20Interface.sol";
import "../common/CrydrModifiers.sol";
import "../controller/CrydrControllerBaseInterface.sol";
import "../common/CrydrIdentifiable.sol";
import "../common/CrydrIdentifiableInterface.sol";
import "../common/CrydrBytecodeExecutable.sol";


/**
 * @title CrydrStorage
 * @dev Implementation of a contract that manages data of an CryDR
 */
contract CrydrStorage is CrydrStorageBaseInterface,
                         CrydrStorageERC20Interface,
                         Pausable,
                         CrydrModifiers,
                         CrydrBytecodeExecutable,
                         CrydrIdentifiable {

  /* Libraries */
  // todo check gas costs without lib

  using SafeMath for uint;


  /* Storage */

  CrydrControllerBaseInterface crydrController;
  mapping (address => uint) balances;
  uint totalSupply;
  mapping (address => mapping (address => uint)) allowed;
  mapping (address => uint) accountBlocks;
  mapping (address => uint) accountBlockedFunds;


  /* Constructor */

  function CrydrStorage(uint _uniqueId) CrydrIdentifiable(_uniqueId) {}


  /* CrydrStorageBaseInterface */

  /* Configuration */

  function setCrydrController(
    address _crydrController
  )
    whenContractPaused
    onlyValidCrydrControllerAddress(_crydrController)
    onlyAllowedManager('set_crydr_controller')
  {
    require(_crydrController != address(crydrController));
    require(_crydrController != address(this));

    crydrController = CrydrControllerBaseInterface(_crydrController);
    CrydrControllerChangedEvent(_crydrController);
  }

  function getCrydrController() constant returns (address) {
    return address(crydrController);
  }

  /* Low-level change of balance and getters. Implied that totalSupply kept in sync. */

  function increaseBalance(
    address _account,
    uint _value
  )
    whenContractNotPaused
    onlyCrydrController
  {
    require(_account != address(0x0));
    require(_value > 0);

    balances[_account] = balances[_account].add(_value);
    totalSupply = totalSupply.add(_value);
    AccountBalanceIncreasedEvent(_account, _value);
  }

  function decreaseBalance(
    address _account,
    uint _value
  )
    whenContractNotPaused
    onlyCrydrController
  {
    require(_account != address(0x0));
    require(_value > 0);

    balances[_account] = balances[_account].sub(_value);
    totalSupply = totalSupply.sub(_value);
    AccountBalanceDecreasedEvent(_account, _value);
  }

  function getBalance(address _account) constant returns (uint) {
    require(_account != address(0x0));

    return balances[_account];
  }

  function getTotalSupply() constant returns (uint) {
    return totalSupply;
  }

  /* Low-level change of allowance and getters */

  function increaseAllowance(
    address _owner,
    address _spender,
    uint _value
  )
    whenContractNotPaused
    onlyCrydrController
  {
    require(_owner != address(0x0));
    require(_spender != address(0x0));
    require(_owner != _spender);
    require(_value > 0);

    allowed[_owner][_spender] = allowed[_owner][_spender].add(_value);
    AccountAllowanceIncreasedEvent(_owner, _spender, _value);
  }

  function decreaseAllowance(
    address _owner,
    address _spender,
    uint _value
  )
    whenContractNotPaused
    onlyCrydrController
  {
    require(_owner != address(0x0));
    require(_spender != address(0x0));
    require(_owner != _spender);
    require(_value > 0);

    allowed[_owner][_spender] = allowed[_owner][_spender].sub(_value);
    AccountAllowanceDecreasedEvent(_owner, _spender, _value);
  }

  function getAllowance(
    address _owner,
    address _spender
  )
    constant
    returns (uint)
  {
    require(_owner != address(0x0));
    require(_spender != address(0x0));
    require(_owner != _spender);

    return allowed[_owner][_spender];
  }

  /* Low-level change of blocks and getters */

  function blockAccount(
    address _account
  )
    whenContractNotPaused
    onlyCrydrController
  {
    require(_account != address(0x0));

    accountBlocks[_account] = accountBlocks[_account].add(1);
    AccountBlockedEvent(_account);
  }

  function unblockAccount(
    address _account
  )
    whenContractNotPaused
    onlyCrydrController
  {
    require(_account != address(0x0));

    accountBlocks[_account] = accountBlocks[_account].sub(1);
    AccountUnblockedEvent(_account);
  }

  function getAccountBlocks(
    address _account
  )
    constant
    returns (uint)
  {
    require(_account != address(0x0));

    return accountBlocks[_account];
  }

  function blockAccountFunds(
    address _account,
    uint _value
  )
    whenContractNotPaused
    onlyCrydrController
  {
    require(_account != address(0x0));
    require(_value > 0);

    accountBlockedFunds[_account] = accountBlockedFunds[_account].add(_value);
    AccountFundsBlockedEvent(_account, _value);
  }

  function unblockAccountFunds(
    address _account,
    uint _value
  )
    whenContractNotPaused
    onlyCrydrController
  {
    require(_account != address(0x0));
    require(_value > 0);

    accountBlockedFunds[_account] = accountBlockedFunds[_account].sub(_value);
    AccountFundsUnblockedEvent(_account, _value);
  }

  function getAccountBlockedFunds(
    address _account
  )
    constant
    returns (uint)
  {
    require(_account != address(0x0));

    return accountBlockedFunds[_account];
  }

  /* CrydrStorageERC20Interface */

  /* ERC20 optimization. _msgsender - account that invoked CrydrView */

  function transfer(
    address _msgsender,
    address _to,
    uint _value
  )
    whenContractNotPaused
    onlyCrydrController
  {
    require(_msgsender != address(0x0));
    require(_to != address(0x0));
    require(_msgsender != _to);
    require(_value > 0);
    require(getAccountBlocks(_msgsender) == 0);
    require(balances[_msgsender].sub(_value) >= getAccountBlockedFunds(_msgsender));

    balances[_msgsender] = balances[_msgsender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    CrydrTransferredEvent(_msgsender, _to, _value);
  }

  function transferFrom(
    address _msgsender,
    address _from,
    address _to,
    uint _value
  )
    whenContractNotPaused
    onlyCrydrController
  {
    require(_msgsender != address(0x0));
    require(_from != address(0x0));
    require(_to != address(0x0));
    require(_from != _to);
    require(_value > 0);
    require(getAccountBlocks(_from) == 0);
    require(balances[_from].sub(_value) >= getAccountBlockedFunds(_msgsender));

    allowed[_from][_msgsender] = allowed[_from][_msgsender].sub(_value);
    balances[_from] = balances[_from].sub(_value);
    balances[_to] = balances[_to].add(_value);
    CrydrTransferredFromEvent(_msgsender, _from, _to, _value);
  }

  function approve(
    address _msgsender,
    address _spender,
    uint _value
  )
    whenContractNotPaused
    onlyCrydrController
  {
    require(_msgsender != address(0x0));
    require(_spender != address(0x0));
    require(_msgsender != _spender);
    require(_value > 0);

    allowed[_msgsender][_spender] = _value;
    CrydrSpendingApprovedEvent(_msgsender, _spender, _value);
  }


  /* Pausable */

  /**
   * @dev Override method to ensure that contract properly configured before it is unpaused
   */
  function unpauseContract()
    onlyValidCrydrControllerAddress(address(crydrController))
  {
    require(CrydrIdentifiable.getUniqueId() == CrydrIdentifiableInterface(crydrController).getUniqueId());
    Pausable.unpauseContract();
  }


  /* Helpers */

  modifier onlyValidCrydrControllerAddress(address _controllerAddress) {
    require(isContract(_controllerAddress) == true);
    _;
  }

  modifier onlyCrydrController {
    require (crydrController != address(0x0));
    require (msg.sender == address(crydrController));
    _;
  }
}
