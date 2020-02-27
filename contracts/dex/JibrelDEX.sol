pragma solidity >=0.4.0 <0.6.0;
pragma experimental ABIEncoderV2;

import './DEXTradingInterface.sol';
import '../crydr/controller/CrydrControllerBlockable/CrydrControllerBlockableInterface.sol';
import '../crydr/controller/CrydrControllerForcedTransfer/CrydrControllerForcedTransferInterface.sol';
import '../crydr/view/CrydrViewERC20/CrydrViewERC20Interface.sol';


contract JibrelDEX is DEXTradingInterface{

//    event SellOrderPlaced(uint _orderId, address _assetToSell, uint256 _amountToSell, address _fiatAsset, uint256 _assetPrice);
//    event BuyOrderPlaced(uint _orderId, address _assetToBuy, uint256 _amountToBuy, address _fiatAsset, uint256 _assetPrice);
//
//    event SellOrderFulfil(address _assetToSell, uint256 _amountToSell, address _fiatAsset, uint256 _assetPrice);
//    event BuyOrderFulfil(address _assetToSell, uint256 _amountToBuy, address _fiatAsset, uint256 _assetPrice);
//
//    event SellOrderCancelled(uint _orderId);
//    event BuyOrderCancelled(uint _orderId);
//
//    struct Order {
//        uint orderId;
//        address submiterAddress;
//        address assetAddress;
//        uint amount;
//        address fiatAddress;
//        uint price;
//        uint timestamp;
//    }
//
//    Order[] public buyOrders;
//    Order[] public sellOrders;
//
//    mapping (uint => uint) buyOrdersIndexes;
//    mapping (uint => uint) sellOrdersIndexes;
//
//    uint sellOrdersCount = 0;
//    uint buyOrdersCount = 0;
//
//    constructor() public{
//
//    }
//
//    function getBuyOrders() public view returns (Order[] memory) {
//      return buyOrders;
//    }
//
//    function placeSellOrder(address _assetToSell, uint256 _amountToSell, address _fiatAsset, uint256 _assetPrice) public returns (uint orderId) {
//        orderId = sellOrdersCount;
//        sellOrders.push(
//            Order({
//                orderId: orderId,  // FIXME
//                submiterAddress: msg.sender,
//                amount: _amountToSell,
//                assetAddress: _assetToSell,
//                fiatAddress: _fiatAsset,
//                price: _assetPrice,
//                timestamp: block.timestamp
//            })
//        );
//        sellOrdersIndexes[orderId] = sellOrders.length - 1;
//        sellOrdersCount += 1;
//        emit SellOrderPlaced(orderId, _assetToSell, _amountToSell, _fiatAsset, _assetPrice);
//        return orderId;
//    }
//
//    function placeBuyOrder(address _assetToBuy, uint256 _amountToBuy, address _fiatAsset, uint256 _assetPrice) public returns (uint orderId) {
//        orderId = buyOrdersCount;
//        buyOrders.push(
//            Order({
//                orderId: orderId,  // FIXME
//                submiterAddress: msg.sender,
//                amount: _amountToBuy,
//                assetAddress: _assetToBuy,
//                fiatAddress: _fiatAsset,
//                price: _assetPrice,
//                timestamp: block.timestamp
//            })
//        );
//        buyOrdersIndexes[orderId] = buyOrders.length - 1;
//        buyOrdersCount += 1;
//        emit BuyOrderPlaced(orderId, _assetToBuy, _amountToBuy, _fiatAsset, _assetPrice);
//        return orderId;
//    }
//
////    function removeById(uint id, Order[] memory arr ) {
////        uint i = 0;
////        while (arr[i].orderId != id) {
////            i++;
////        }
////
////        while (i < arr.length - 1) {
////            arr[i] = arr[i+1];
////            i++;
////        }
////        arr.length--;
////    }
//
//    function cancelBuyOrder(uint256 _orderID) public{
//        uint i = 0;
//
//        while (buyOrders[i].orderId != _orderID) {
//            i++;
//        }
//
//        while (i < buyOrders.length - 1) {
//            buyOrders[i] = buyOrders[i+1];
//            i++;
//        }
//        buyOrders.length--;
//        emit BuyOrderCancelled(_orderID);
//    }
//
//    fulfilSellOrder(uint256 _orderID){
//
//    }
//
//    function fulfilBuyOrder(uint256 _orderID){
//
//    }

//  struct OrderData {
//    address orderCreator;
//    uint256 orderCreationTimestamp;
//
//    uint256 orderID;
//    OrderType orderType;
//    address tradedAsset;
//    uint256 tradedAssetAmount;
//    address fiatAsset;
//    uint256 fiatPrice; // fiat price for 10^18 of traded asset
//    uint256 expirationTimestamp;
//
//    OrderStatus orderStatus;
//    uint256 remainingTradedAssetAmount;
//  }

  OrderData[] public orders;
  OrderTrade[] public trades;

  uint ordersCount = 0;
  uint tradesCount = 0;

  function removeOrderById(uint orderID) private {
      uint i = 0;
      while (orders[i].orderID != orderID) {
          i++;
      }

      while (i < orders.length - 1) {
          orders[i] = orders[i+1];
          i++;
      }
      orders.length--;
    }

  function listOrders() public view returns (OrderData[] memory){
    return orders;
  }

  function getOrderData(uint256 _orderID) public view returns (OrderData memory){
      return orders[_orderID];
  }

  function placeSellOrder(address _tradedAsset, uint256 _amountToSell, address _fiatAsset, uint256 _assetPrice, uint256 _expirationTimestamp) external returns (uint256){
    uint orderId = ordersCount;
    orders.push(
        OrderData({
            orderID: orderId,  // FIXME
            orderCreator: msg.sender,
            orderCreationTimestamp: block.timestamp,
            orderType: OrderType.Sell,
            tradedAssetAmount: _amountToSell,
            tradedAsset: _tradedAsset,
            fiatAsset: _fiatAsset,
            fiatPrice: _assetPrice,
            remainingTradedAssetAmount: _amountToSell,
            orderStatus: OrderStatus.Placed,
            expirationTimestamp: _expirationTimestamp
        })
    );
//        sellOrdersIndexes[orderId] = sellOrders.length - 1;
    ordersCount += 1;

    CrydrControllerBlockableInterface(_tradedAsset).blockAccountFunds(msg.sender, _amountToSell);

    emit OrderPlacedEvent(msg.sender,
                     orderId,
                     OrderType.Sell,
                     _tradedAsset,
                     _amountToSell,
                     _fiatAsset,
                     _assetPrice,
                     _expirationTimestamp );
    return orderId;
  }

  function placeBuyOrder(address _tradedAsset, uint256 _amountToBuy, address _fiatAsset, uint256 _assetPrice, uint256 _expirationTimestamp) external returns (uint256){
    uint orderId = ordersCount;
    orders.push(
        OrderData({
            orderID: orderId,  // FIXME
            orderCreator: msg.sender,
            orderCreationTimestamp: block.timestamp,
            orderType: OrderType.Buy,
            tradedAssetAmount: _amountToBuy,
            tradedAsset: _tradedAsset,
            fiatAsset: _fiatAsset,
            fiatPrice: _assetPrice,
            remainingTradedAssetAmount: _amountToBuy,
            orderStatus: OrderStatus.Placed,
            expirationTimestamp: _expirationTimestamp
        })
    );
//        sellOrdersIndexes[orderId] = sellOrders.length - 1;
    ordersCount += 1;

    CrydrControllerBlockableInterface(_fiatAsset).blockAccountFunds(msg.sender, _amountToBuy);

    emit OrderPlacedEvent(msg.sender,
                     orderId,
                     OrderType.Buy,
                     _tradedAsset,
                     _amountToBuy,
                     _fiatAsset,
                     _assetPrice,
                     _expirationTimestamp );
    return orderId;
  }

  function cancelOrder(uint256 _orderID) external {
    removeOrderById(_orderID);
    emit OrderCancelledEvent(_orderID);
  }

  /* calculate how much fiat will be used to buy a particular amount of asset */
  function calculateAssetBuyAmount(uint256 _orderID, uint256 _tradedAssetAmount) public view returns (uint256){
    return orders[_orderID].fiatPrice * _tradedAssetAmount;
  }


  function getOrderTrades(uint _orderID) public view returns (OrderTrade[] memory){
    uint rescount = 0;
    uint i = 0;
    uint n = 0;
    while (i < trades.length - 1) {
          if(trades[i].orderID == _orderID){
            rescount++;
          }
          i++;
    }
    OrderTrade[] memory res = new OrderTrade[](rescount);
    i = 0;

    while (i < trades.length - 1) {
          if(trades[i].orderID == _orderID){
            res[n] = trades[i];
            n++;
          }
          i++;
    }
    return res;
  }


  /*
    enum TradeStatus { Placed, Completed, Cancelled }

  struct OrderTrade {
    address tradeCreator;
    uint256 tradeCreationTimestamp;

    uint256 tradeID;
    uint256 orderID;
    uint256 tradeAmount;

    TradeStatus tradeStatus;
  }
  */

  function executeSellOrder(uint256 _orderID, uint256 _amountToBuy) external returns (uint256){
      //check availability
      OrderData memory order = orders[_orderID];  // FIXME!! memory??
      uint256 fundsRequired = order.fiatPrice * _amountToBuy;

      require(msg.sender != order.orderCreator, "Could not execute order of yourself");
      require(order.remainingTradedAssetAmount >= _amountToBuy, "Not enough remained amount");
      require(CrydrViewERC20Interface(order.tradedAsset).balanceOf(msg.sender) >= fundsRequired,
              "Not ehough fiat assets");

      // crate Trade
      uint tradeId = tradesCount;
      OrderTrade memory trade = OrderTrade({
        tradeCreator: msg.sender,
        tradeCreationTimestamp: block.timestamp,
        tradeID: tradeId,
        orderID: _orderID,
        tradeAmount: _amountToBuy,
        tradeStatus: TradeStatus.Completed  // FIXME!!!
      });

      trades.push(trade);
      tradesCount++;

      // make exchange
//      CrydrViewERC20Interface(order.tradedAsset).unblock
      // transfer fiats to seller
      CrydrControllerBlockableInterface(order.fiatAsset).unblockAccountFunds(msg.sender, fundsRequired);
      CrydrControllerForcedTransferInterface(order.fiatAsset).forcedTransfer(msg.sender, order.orderCreator, fundsRequired);

      // transfer assets to buyer
      CrydrControllerBlockableInterface(order.tradedAsset).unblockAccountFunds(order.orderCreator, _amountToBuy);
      CrydrControllerForcedTransferInterface(order.tradedAsset).forcedTransfer(order.orderCreator, msg.sender, _amountToBuy);

      order.remainingTradedAssetAmount -= _amountToBuy;
      // emit events
      emit TradePlacedEvent(trade.tradeCreator, trade.tradeID, trade.orderID, trade.tradeAmount);
      emit TradeCompletedEvent(trade.tradeID);

      // check if we can complete order
      if (order.remainingTradedAssetAmount == 0){
        order.orderStatus = OrderStatus.Completed;
      }
  }

  function executeBuyOrder(uint256 _orderID, uint256 _amountToSell) external returns (uint256){

  }

  function cancelTrade(uint256 _tradeID) external {
      uint i = 0;
      while (trades[i].tradeID != _tradeID) {
          i++;
      }
      trades[i].tradeStatus = TradeStatus.Cancelled;
//      while (i < trades.length - 1) {
//          trades[i] = trades[i+1];
//          i++;
//      }
//      trades.length--;
      emit TradeCancelledEvent(_tradeID);
  }

}

/*

let dex = await JibrelDEX.new()
await dex.getBuyOrders()
await dex.placeBuyOrder(accounts[3], 100, accounts[4], 1024)
await dex.placeBuyOrder(accounts[5], 200, accounts[4], 1024)
await dex.placeBuyOrder(accounts[6], 300, accounts[4], 1024)
await dex.placeBuyOrder(accounts[7], 400, accounts[4], 1024)

await dex.cancelBuyOrder(2)
*/
