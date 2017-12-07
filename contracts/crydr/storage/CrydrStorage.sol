/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../third-party/zeppelin-solidity/SafeMath.sol";
import "../../lifecycle/Pausable.sol";
import "../../util/CommonModifiers.sol";
import "../../feature/bytecode/BytecodeExecutable.sol";
import "../../feature/assetid/AssetIDInterface.sol";
import "../../feature/assetid/AssetID.sol";
import "./CrydrStorageBaseInterface.sol";
import "./CrydrStorageERC20Interface.sol";
import "../controller/CrydrControllerBaseInterface.sol";


/**
 * @title CrydrStorage
 * @dev Implementation of a contract that manages data of an CryDR
 */
contract CrydrStorage is CrydrStorageBaseInterface,
                         CrydrStorageERC20Interface,
                         Pausable,
                         CommonModifiers,
                         BytecodeExecutable,
                         AssetID,
                         SafeMath {

  /* Storage */

  CrydrControllerBaseInterface crydrController;
  mapping (address => uint256) balances;
  uint256 totalSupply;
  mapping (address => mapping (address => uint256)) allowed;
  mapping (address => uint256) accountBlocks;
  mapping (address => uint256) accountBlockedFunds;


  /* Constructor */

  function CrydrStorage(string _assetID) AssetID(_assetID) public {
    accountBlocks[0x0] = (0xffffffffffffffff - 1);
  }


  /* CrydrStorageBaseInterface */

  /* Configuration */

  function setCrydrController(
    address _crydrController
  )
    external
    whenContractPaused
    onlyContractAddress(_crydrController)
    onlyAllowedManager('set_crydr_controller')
  {
    require(_crydrController != address(crydrController));
    require(_crydrController != address(this));

    crydrController = CrydrControllerBaseInterface(_crydrController);
    CrydrControllerChangedEvent(_crydrController);
  }

  function getCrydrController() public constant returns (address) {
    return address(crydrController);
  }

  /* Low-level change of balance and getters. Implied that totalSupply kept in sync. */

  function increaseBalance(
    address _account,
    uint256 _value
  )
    external
    whenContractNotPaused
    onlyCrydrController
  {
    require(_account != address(0x0));
    require(_value > 0);

    balances[_account] = safeAdd(balances[_account], _value);
    totalSupply = safeAdd(totalSupply, _value);
    AccountBalanceIncreasedEvent(_account, _value);
  }

  function decreaseBalance(
    address _account,
    uint256 _value
  )
    external
    whenContractNotPaused
    onlyCrydrController
  {
    require(_account != address(0x0));
    require(_value > 0);

    balances[_account] = safeSub(balances[_account], _value);
    totalSupply = safeSub(totalSupply, _value);
    AccountBalanceDecreasedEvent(_account, _value);
  }

  function getBalance(address _account) public constant returns (uint256) {
    require(_account != address(0x0));

    return balances[_account];
  }

  function getTotalSupply() public constant returns (uint256) {
    return totalSupply;
  }

  /* Low-level change of allowance and getters */

  function increaseAllowance(
    address _owner,
    address _spender,
    uint256 _value
  )
    external
    whenContractNotPaused
    onlyCrydrController
  {
    require(_owner != address(0x0));
    require(_spender != address(0x0));
    require(_owner != _spender);
    require(_value > 0);

    allowed[_owner][_spender] = safeAdd(allowed[_owner][_spender], _value);
    AccountAllowanceIncreasedEvent(_owner, _spender, _value);
  }

  function decreaseAllowance(
    address _owner,
    address _spender,
    uint256 _value
  )
    external
    whenContractNotPaused
    onlyCrydrController
  {
    require(_owner != address(0x0));
    require(_spender != address(0x0));
    require(_owner != _spender);
    require(_value > 0);

    allowed[_owner][_spender] = safeSub(allowed[_owner][_spender], _value);
    AccountAllowanceDecreasedEvent(_owner, _spender, _value);
  }

  function getAllowance(
    address _owner,
    address _spender
  )
    public
    constant
    returns (uint256)
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
    external
    onlyCrydrController
  {
    require(_account != address(0x0));

    accountBlocks[_account] = safeAdd(accountBlocks[_account], 1);
    AccountBlockedEvent(_account);
  }

  function unblockAccount(
    address _account
  )
    external
    whenContractNotPaused
    onlyCrydrController
  {
    require(_account != address(0x0));

    accountBlocks[_account] = safeSub(accountBlocks[_account], 1);
    AccountUnblockedEvent(_account);
  }

  function getAccountBlocks(
    address _account
  )
    public
    constant
    returns (uint256)
  {
    require(_account != address(0x0));

    return accountBlocks[_account];
  }

  function blockAccountFunds(
    address _account,
    uint256 _value
  )
    external
    onlyCrydrController
  {
    require(_account != address(0x0));
    require(_value > 0);

    accountBlockedFunds[_account] = safeAdd(accountBlockedFunds[_account], _value);
    AccountFundsBlockedEvent(_account, _value);
  }

  function unblockAccountFunds(
    address _account,
    uint256 _value
  )
    external
    whenContractNotPaused
    onlyCrydrController
  {
    require(_account != address(0x0));
    require(_value > 0);

    accountBlockedFunds[_account] = safeSub(accountBlockedFunds[_account], _value);
    AccountFundsUnblockedEvent(_account, _value);
  }

  function getAccountBlockedFunds(
    address _account
  )
    public
    constant
    returns (uint256)
  {
    require(_account != address(0x0));

    return accountBlockedFunds[_account];
  }

  /* CrydrStorageERC20Interface */

  /* ERC20 optimization. _msgsender - account that invoked CrydrView */

  function transfer(
    address _msgsender,
    address _to,
    uint256 _value
  )
    external
    whenContractNotPaused
    onlyCrydrController
  {
    require(_msgsender != address(0x0));
    require(_to != address(0x0));
    require(_msgsender != _to);
    require(_value > 0);
    require(getAccountBlocks(_msgsender) == 0);
    require(safeSub(balances[_msgsender], _value) >= getAccountBlockedFunds(_msgsender));

    balances[_msgsender] = safeSub(balances[_msgsender], _value);
    balances[_to] = safeAdd(balances[_to], _value);
    CrydrTransferredEvent(_msgsender, _to, _value);
  }

  function transferFrom(
    address _msgsender,
    address _from,
    address _to,
    uint256 _value
  )
    external
    whenContractNotPaused
    onlyCrydrController
  {
    require(_msgsender != address(0x0));
    require(_from != address(0x0));
    require(_to != address(0x0));
    require(_from != _to);
    require(_value > 0);
    require(getAccountBlocks(_from) == 0);
    require(safeSub(balances[_from], _value) >= getAccountBlockedFunds(_msgsender));

    allowed[_from][_msgsender] = safeSub(allowed[_from][_msgsender], _value);
    balances[_from] = safeSub(balances[_from], _value);
    balances[_to] = safeAdd(balances[_to], _value);
    CrydrTransferredFromEvent(_msgsender, _from, _to, _value);
  }

  function approve(
    address _msgsender,
    address _spender,
    uint256 _value
  )
    external
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
  function unpauseContract() public {
    require(isContract(address(crydrController)) == true);
    require(AssetID.getAssetIDHash() == AssetIDInterface(crydrController).getAssetIDHash());

    Pausable.unpauseContract();
  }


  /* Helpers */

  modifier onlyCrydrController {
    require (crydrController != address(0x0));
    require (msg.sender == address(crydrController));
    _;
  }
}
