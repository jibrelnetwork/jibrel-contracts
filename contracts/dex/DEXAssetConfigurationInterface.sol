pragma solidity >=0.4.0 <0.6.0;
pragma experimental ABIEncoderV2;


/**
 * @title DEXAssetConfigurationInterface interface
 * @dev Configuration of a contract
 */
contract DEXAssetConfigurationInterface {

  /* Events */

  event FiatAddedEvent(address indexed viewAddress, address indexed controllerAddress, uint8 decimals);
  event FiatUpdatedEvent(address indexed viewAddress, address indexed controllerAddress, uint8 decimals);
  event AssetAddedEvent(address indexed viewAddress, address indexed controllerAddress, uint8 decimals);
  event AssetUpdatedEvent(address indexed viewAddress, address indexed controllerAddress, uint8 decimals);

  event FiatOperationsBlocked(address fiat);
  event FiatOperationsUnblocked(address fiat);
  event AssetOperationsBlocked(address asset);
  event AssetOperationsUnblocked(address asset);


  /* Functions */

  function addFiatToken(address _tokenERC20Address, address _tokenControllerAddress, uint8 _decimals) external;
  function updateFiatToken(address _tokenERC20Address, address _newTokenControllerAddress, uint8 _decimals) external;
  function blockFiatOperations(address _tokenERC20Address) external;
  function unblockFiatOperations(address _tokenERC20Address) external;

  function addAssetToken(address _tokenERC20Address, address _tokenControllerAddress, uint8 _decimals) external;
  function updateAssetToken(address _tokenERC20Address, address _newTokenControllerAddress, uint8 _decimals) external;
  function blockAssetOperations(address _tokenERC20Address) external;
  function unblockAssetOperations(address _tokenERC20Address) external;
}
