pragma solidity >=0.4.0 <0.6.0;
pragma experimental ABIEncoderV2;

contract JibrelDEX {

    event SellOrderPlaced(uint _orderId, address _assetToSell, uint256 _amountToSell, address _fiatAsset, uint256 _assetPrice);
    event BuyOrderPlaced(uint _orderId, address _assetToBuy, uint256 _amountToBuy, address _fiatAsset, uint256 _assetPrice);

    event SellOrderFulfil(address _assetToSell, uint256 _amountToSell, address _fiatAsset, uint256 _assetPrice);
    event BuyOrderFulfil(address _assetToSell, uint256 _amountToBuy, address _fiatAsset, uint256 _assetPrice);

    event SellOrderCancelled(uint _orderId);
    event BuyOrderCancelled(uint _orderId);

    struct Order {
        uint orderId;
        address submiterAddress;
        address assetAddress;
        uint amount;
        address fiatAddress;
        uint price;
        uint timestamp;
    }

    Order[] public buyOrders;
    Order[] public sellOrders;

    mapping (uint => uint) buyOrdersIndexes;
    mapping (uint => uint) sellOrdersIndexes;

    uint sellOrdersCount = 0;
    uint buyOrdersCount = 0;

    constructor() public{

    }

    function getBuyOrders() public view returns (Order[] memory) {
      return buyOrders;
    }

    function placeSellOrder(address _assetToSell, uint256 _amountToSell, address _fiatAsset, uint256 _assetPrice) public returns (uint orderId) {
        orderId = sellOrdersCount;
        sellOrders.push(
            Order({
                orderId: orderId,  // FIXME
                submiterAddress: msg.sender,
                amount: _amountToSell,
                assetAddress: _assetToSell,
                fiatAddress: _fiatAsset,
                price: _assetPrice,
                timestamp: block.timestamp
            })
        );
        sellOrdersIndexes[orderId] = sellOrders.length - 1;
        sellOrdersCount += 1;
        emit SellOrderPlaced(orderId, _assetToSell, _amountToSell, _fiatAsset, _assetPrice);
        return orderId;
    }

    function placeBuyOrder(address _assetToBuy, uint256 _amountToBuy, address _fiatAsset, uint256 _assetPrice) public returns (uint orderId) {
        orderId = buyOrdersCount;
        buyOrders.push(
            Order({
                orderId: orderId,  // FIXME
                submiterAddress: msg.sender,
                amount: _amountToBuy,
                assetAddress: _assetToBuy,
                fiatAddress: _fiatAsset,
                price: _assetPrice,
                timestamp: block.timestamp
            })
        );
        buyOrdersIndexes[orderId] = buyOrders.length - 1;
        buyOrdersCount += 1;
        emit BuyOrderPlaced(orderId, _assetToBuy, _amountToBuy, _fiatAsset, _assetPrice);
        return orderId;
    }

//    function removeById(uint id, Order[] memory arr ) {
//        uint i = 0;
//        while (arr[i].orderId != id) {
//            i++;
//        }
//
//        while (i < arr.length - 1) {
//            arr[i] = arr[i+1];
//            i++;
//        }
//        arr.length--;
//    }

    function cancelBuyOrder(uint256 _orderID) public{
        uint i = 0;

        while (buyOrders[i].orderId != _orderID) {
            i++;
        }

        while (i < buyOrders.length - 1) {
            buyOrders[i] = buyOrders[i+1];
            i++;
        }
        buyOrders.length--;
        emit BuyOrderCancelled(_orderID);
    }
//
//    fulfilSellOrder(uint256 _orderID){
//
//    }
//
//    function fulfilBuyOrder(uint256 _orderID){
//
//    }
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
