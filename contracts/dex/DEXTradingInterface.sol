pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;


/**
 * @title DEXTradingInterface interface
 * @dev Interface of a contract that implements decentralized trading
 */
contract DEXTradingInterface {

  /* Orders */

  enum OrderType { Buy, Sell }

  event OrderPlacedEvent(address indexed orderCreator, string indexed orderID, OrderType orderType, address indexed tradedAsset, uint256 tradedAmount, address fiatAsset, uint256 assetPrice, uint256 expirationTimestamp);
  event OrderActivatedEvent(string indexed orderID);
  event OrderCompletedEvent(string indexed orderID);
  event OrderCancelledEvent(string indexed orderID);
  event OrderExpiredEvent(string indexed orderID);

  /**
   * Placed - a new order that requires an approval to be activated (if settings of an asset set a requirement for new orders to be approved)
   * Active - order is active and can be executed
   * Completed - order is completely fulfilled
   * Cancelled - user/admin cancelled the order
   * Expired - admin expired the order
  */
  enum OrderStatus { Placed, Active, Completed, Cancelled, Expired }

  struct OrderData {
    address orderCreator;
    uint256 orderCreationTimestamp;

    uint256 orderID;
    OrderType orderType;
    address tradedAsset;
    uint256 tradedAssetAmount;
    address fiatAsset;
    uint256 fiatPrice; // fiat price for 10^18 of traded asset
    uint256 expirationTimestamp;

    OrderStatus orderStatus;
    uint256 remainingTradedAssetAmount;
  }

  function getOrderData(uint256 _orderID) view returns (OrderData);
  function placeSellOrder(address _tradedAsset, uint256 _amountToSell, address _fiatAsset, uint256 _assetPrice, uint256 _expirationTimestamp) external returns (uint256);
  function placeBuyOrder(address _tradedAsset, uint256 _amountToBuy, address _fiatAsset, uint256 _assetPrice, uint256 _expirationTimestamp) external returns (uint256);
  function cancelOrder(uint256 _orderID) external;

  /* calculate how much fiat will be used to buy a particular amount of asset */
  function calculateAssetBuyAmount(uint256 _orderID, uint256 _tradedAssetAmount) view returns (uint256);



  /* Trades */

  event TradePlacedEvent(address indexed tradeCreator, uint256 indexed tradeID, string indexed orderID, uint256 tradedAmount);
  event TradeCompletedEvent(uint256 indexed tradeID);
  event TradeCancelledEvent(uint256 indexed tradeID);

  /**
   * Placed - a new application to execute an existing order
   * Completed - application to execute an existing order was approved and executed
   * Cancelled - application to execute an existing order was cancelled
  */
  enum TradeStatus { Placed, Completed, Cancelled }

  struct OrderTrade {
    address tradeCreator;
    uint256 tradeCreationTimestamp;

    uint256 tradeID;
    uint256 orderID;
    address tradeAmount;

    TradeStatus tradeStatus;
  }

  function getOrderTrades(uint _orderID) view returns (OrderTrade[]);
  function executeSellOrder(uint256 _orderID, uint256 _amountToBuy) external returns (uint256);
  function executeBuyOrder(uint256 _orderID, uint256 _amountToSell) external returns (uint256);
  function cancelTrade(uint256 _tradeID) external;



  /* Blocking of tokens */

  event TokensBlockedEvent(address indexed userAddress, address indexed assetAddress, uint256 assetAmount);
  event TokensUnblockedEvent(address indexed userAddress, address indexed assetAddress, uint256 assetAmount);
}
