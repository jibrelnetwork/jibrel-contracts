/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.24;


import '../lifecycle/Ownable.sol';
import '../lifecycle/Manageable.sol';
import '../lifecycle/Pausable.sol';
import '../crydr/view/CrydrViewERC20Interface.sol';


/**
 * @title JcashRegistrar
 * @dev Implementation of a contract that can receives ETH&ERC20, refunds ETH&ERC20 and logs these operations
 */
contract JcashRegistrar is Ownable,
                           Manageable,
                           Pausable {

  /* Storage */

  address manager = address(0x0);
  mapping (address => bool) replenishers;
  mapping (bytes32 => bool) processedTxs;


  /* Events */

  event ReceiveEthEvent(address indexed from, uint256 value);
  event RefundEthEvent(bytes32 txhash, address indexed to, uint256 value);
  event TransferEthEvent(bytes32 txhash, address indexed to, uint256 value);
  event RefundTokenEvent(bytes32 txhash, address indexed tokenaddress, address indexed to, uint256 value);
  event TransferTokenEvent(bytes32 txhash, address indexed tokenaddress, address indexed to, uint256 value);

  event ReplenisherEnabledEvent(address indexed replenisher);
  event ReplenisherDisabledEvent(address indexed replenisher);
  event ReplenishEthEvent(address indexed from, uint256 value);
  event WithdrawEthEvent(address indexed to, uint256 value);
  event WithdrawTokenEvent(address indexed tokenaddress, address indexed to, uint256 value);

  event ManagerChangedEvent(address indexed manager);
  event PauseEvent();
  event UnpauseEvent();


  /* Modifiers */

  /**
   * @dev Modifiers that throws if called by any account other than the current manager.
   */
  modifier onlymanager {
    require (msg.sender == manager);

    _;
  }

  /**
   * @dev Fix for the ERC20 short address attack.
   */
  modifier onlyPayloadSize(uint256 size) {
    require(msg.data.length == (size + 4));

    _;
  }

  /**
   * @dev Fallback function allowing the contract to receive funds, if contract haven't already been paused.
   */
  function () external payable {
    if (replenishers[msg.sender]==true) {
      emit ReplenishEthEvent(msg.sender, msg.value);
    } else {
      require (getPaused() == false);
      emit ReceiveEthEvent(msg.sender, msg.value);
    }
  }

  /**
   * @dev Allows to withdraw ETH by Replenisher.
   */
  function withdrawEth(
    uint256 _weivalue
  )
    external
    onlyPayloadSize(1 * 32)
  {
    require (replenishers[msg.sender] == true);
    require (_weivalue > 0);

    address(msg.sender).transfer(_weivalue);
    emit WithdrawEthEvent(msg.sender, _weivalue);
  }

  /**
   * @dev Allows to withdraw tokens by Replenisher.
   */
  function withdrawToken(
    address _tokenAddress,
    uint256 _weivalue
  )
    external
    onlyPayloadSize(2 * 32)
  {
    require (replenishers[msg.sender] == true);
    require (_tokenAddress != address(0x0));
    require (_tokenAddress != address(this));
    require (_weivalue > 0);

    CrydrViewERC20Interface(_tokenAddress).transfer(msg.sender, _weivalue);
    emit WithdrawTokenEvent(_tokenAddress, msg.sender, _weivalue);
  }

  /**
   * @dev Change contract manager
   */
  function changeManager(address _newManager) external onlyOwner {
    require (_newManager != address(0x0));
    require (_newManager != address(this));
    require (_newManager != manager);

    manager = _newManager;
    emit ManagerChangedEvent(_newManager);
  }

  /**
   * @dev Function to add new replenisher
   * @param _replenisher address New replenisher
   */
  function enableReplenisher(address _replenisher) external onlymanager {
    require (_replenisher != address(0x0));
    require (_replenisher != address(this));
    require (replenishers[_replenisher] == false);

    replenishers[_replenisher] = true;
    emit ReplenisherEnabledEvent(_replenisher);
  }

  /**
   * @dev Function to remove existing replenisher
   * @param _replenisher address Existing replenisher
   */
  function disableReplenisher(address _replenisher) external onlymanager {
    require (_replenisher != address(0x0));
    require (_replenisher != address(this));
    require (replenishers[_replenisher] == true);

    replenishers[_replenisher] = false;
    emit ReplenisherDisabledEvent(_replenisher);
  }

  /**
   * @dev Allows to perform refund ETH.
   */
  function refundEth(
    bytes32 _txHash,
    address _to,
    uint256 _weivalue
  )
    external
    onlymanager
    whenContractNotPaused
    onlyPayloadSize(3 * 32)
  {
    require (_txHash != bytes32(0));
    require (processedTxs[_txHash] == false);
    require (_to != address(0x0));
    require (_to != address(this));
    require (_weivalue > 0);

    processedTxs[_txHash] = true;
    _to.transfer(_weivalue);
    emit RefundEthEvent(_txHash, _to, _weivalue);
  }

  /**
   * @dev Allows to perform refund ERC20 tokens.
   */
  function refundToken(
    bytes32 _txHash,
    address _tokenAddress,
    address _to,
    uint256 _weivalue
  )
    external
    onlymanager
    whenContractNotPaused
    onlyPayloadSize(4 * 32)
  {
    require (_txHash != bytes32(0));
    require (processedTxs[_txHash] == false);
    require (_tokenAddress != address(0x0));
    require (_tokenAddress != address(this));
    require (_to != address(0x0));
    require (_to != address(this));
    require (_weivalue > 0);

    processedTxs[_txHash] = true;
    CrydrViewERC20Interface(_tokenAddress).transfer(_to, _weivalue);
    emit RefundTokenEvent(_txHash, _tokenAddress, _to, _weivalue);
  }

  /**
   * @dev Allows to perform transfer ETH.
   *
   */
  function transferEth(
    bytes32 _txHash,
    address _to,
    uint256 _weivalue
  )
    external
    onlymanager
    whenContractNotPaused
    onlyPayloadSize(3 * 32)
  {
    require (_txHash != bytes32(0));
    require (processedTxs[_txHash] == false);
    require (_to != address(0x0));
    require (_to != address(this));
    require (_weivalue > 0);

    processedTxs[_txHash] = true;
    _to.transfer(_weivalue);
    emit TransferEthEvent(_txHash, _to, _weivalue);
  }

  /**
   * @dev Allows to perform transfer ERC20 tokens.
   */
  function transferToken(
    bytes32 _txHash,
    address _tokenAddress,
    address _to,
    uint256 _weivalue
  )
    external
    onlymanager
    whenContractNotPaused
    onlyPayloadSize(4 * 32)
  {
    require (_txHash != bytes32(0));
    require (processedTxs[_txHash] == false);
    require (_tokenAddress != address(0x0));
    require (_tokenAddress != address(this));
    require (_to != address(0x0));
    require (_to != address(this));
    require(processedTxs[_txHash] == false);

    processedTxs[_txHash] = true;
    CrydrViewERC20Interface(_tokenAddress).transfer(_to, _weivalue);
    emit TransferTokenEvent(_txHash, _tokenAddress, _to, _weivalue);
  }


  /* Getters */

  /**
   * @dev The getter for "manager" contract variable
   */
  function getManager() public view returns (address)
  {
    return manager;
  }

  /**
   * @dev The getter for "replenishers" contract variable
   */
  function isReplenisher(
    address _address
  )
    public
    view
    onlyPayloadSize(1 * 32)
    returns (bool)
  {
    require (_address != address(0x0));

    return replenishers[_address];
  }

  /**
   * @dev The getter returns Eth balance
   */
  function balanceEth() public view returns (uint256) {
    return address(this).balance;
  }

  /**
   * @dev The getter returns token's balance
   */
  function balanceToken(address _tokenAddress) public view returns (uint256) {
    return CrydrViewERC20Interface(_tokenAddress).balanceOf(address(this));
  }

  /**
   * @dev The getter returns true if tx hash is processed
   */
  function isProcessedTx(
    bytes32 _txHash
  )
    public
    view
    onlyPayloadSize(1 * 32)
    returns (bool)
  {
    return processedTxs[_txHash];
  }
}
