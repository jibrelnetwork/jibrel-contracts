/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity >=0.4.0 <0.6.0;


/**
 * @title JcashRegistrarInterface
 * @dev Interface of a contract that can receives ETH&ERC20, refunds ETH&ERC20 and logs these operations
 */
contract JcashRegistrarInterface {

  /* Events */

  event ReceiveEthEvent(address indexed from, uint256 value);
  event RefundEthEvent(bytes32 txhash, address indexed to, uint256 value);
  event TransferEthEvent(bytes32 txhash, address indexed to, uint256 value);

  event RefundTokenEvent(bytes32 txhash, address indexed tokenaddress, address indexed to, uint256 value);
  event TransferTokenEvent(bytes32 txhash, address indexed tokenaddress, address indexed to, uint256 value);

  event ReplenishEthEvent(address indexed from, uint256 value);
  event WithdrawEthEvent(address indexed to, uint256 value);
  event WithdrawTokenEvent(address indexed tokenaddress, address indexed to, uint256 value);

  event PauseEvent();
  event UnpauseEvent();


  /* Replenisher actions */

  /**
   * @dev Allows to withdraw ETH by Replenisher.
   */
  function withdrawEth(uint256 _weivalue) external;

  /**
   * @dev Allows to withdraw tokens by Replenisher.
   */
  function withdrawToken(address _tokenAddress, uint256 _weivalue) external;


  /* Processing of exchange operations */

  /**
   * @dev Allows to perform refund ETH.
   */
  function refundEth(bytes32 _txHash, address payable _to, uint256 _weivalue) external;

  /**
   * @dev Allows to perform refund ERC20 tokens.
   */
  function refundToken(bytes32 _txHash, address _tokenAddress, address _to, uint256 _weivalue) external;

  /**
   * @dev Allows to perform transfer ETH.
   *
   */
  function transferEth(bytes32 _txHash, address payable _to, uint256 _weivalue) external;

  /**
   * @dev Allows to perform transfer ERC20 tokens.
   */
  function transferToken(bytes32 _txHash, address _tokenAddress, address _to, uint256 _weivalue) external;


  /* Getters */

  /**
   * @dev The getter returns true if tx hash is processed
   */
  function isProcessedTx(bytes32 _txHash) public view returns (bool);
}
