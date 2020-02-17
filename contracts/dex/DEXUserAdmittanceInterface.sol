pragma solidity >=0.4.0 <0.6.0;
pragma experimental ABIEncoderV2;


/**
 * @title DEXUserAdmittance interface
 * @dev Allows to control access of users to the trading
 * By default admin needs to call only "admitUser" to gih full access to the trading.
 * Blocking on per-asset and per-fiat level is for special cases.
 */
contract DEXUserAdmittanceInterface {

  /* Events */

  event UserAdmittedEvent(address indexed userAddress);
  event UserBlockedEvent(address indexed userAddress);

  event UserFiatOperationsBlockedEvent(address indexed userAddress, address indexed fiatAddress);
  event UserFiatOperationsUnblockedEvent(address indexed userAddress, address indexed fiatAddress);

  event UserAssetOperationsBlockedEvent(address indexed userAddress, address indexed assetAddress);
  event UserAssetOperationsUnblockedEvent(address indexed userAddress, address indexed assetAddress);


  /* Functions */

  function admitUser(address _userAddress) external;
  function denyUser(address _userAddress) external;

  function blockUserOperationsWithFiat(address _userAddress, address _tokenAddress) external;
  function unblockUserOperationsWithFiat(address _userAddress, address _tokenAddress) external;

  function blockUserOperationsWithAsset(address _userAddress, address _tokenAddress) external;
  function unblockUserOperationsWithAsset(address _userAddress, address _tokenAddress) external;
}
