pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;


/**
 * @title DEXForcibleActions interface
 * @dev Allows admin to make forcible actions on orders
 */
contract DEXForcibleActionsInterface {

  /* Functions */

  function forciblyPlaceSellOrder(address _sellerAddress, address _tradedAsset, uint256 _amountToSell, address _fiatAsset, uint256 _assetPrice) external returns (uint256);
  function forciblyPlaceBuyOrder(address _buyerAddress, address _tradedAsset, uint256 _amountToBuy, address _fiatAsset, uint256 _assetPrice) external returns (uint256);
  function forciblyActivateOrder(address _orderID) external;
  function forciblyCancelOrder(address _orderID) external;
  function forciblyExpireOrder(address _orderID) external;

  function forciblyExecuteSellOrder(address _buyerAddress, uint256 _orderID, uint256 _amountToBuy) external returns (uint256);
  function forciblyExecuteBuyOrder(address _sellerAddress, uint256 _orderID, uint256 _amountToSell) external returns (uint256);
  function forciblyCompleteTrade(uint256 _tradeID) external;
  function forciblyCancelTrade(uint256 _tradeID) external;
}
