/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import "./Ownable.sol";


/**
 * @title Manageable
 * @dev Contract that allows to grant permissions to any address
 * @dev In real life we are no able to perform all actions with just one Ethereum address
 * @dev because risks are too high.
 * @dev Instead owner delegates rights to manage an contract to the different addresses and
 * @dev stay able to revoke permissions at any time.
 */
contract Manageable is Ownable {

  /* Storage */

  mapping (address => bool) managerEnabled;  // hard switch for a manager - on/off
  mapping (address => mapping (string => bool)) managerPermissions;  // detailed info about manager`s permissions


  /* Events */

  event ManagerEnabledEvent(address indexed manager);
  event ManagerDisabledEvent(address indexed manager);
  event ManagerPermissionGrantedEvent(address indexed manager, string permission);
  event ManagerPermissionRevokedEvent(address indexed manager, string permission);


  /* Configure contract */

  /**
   * @dev Function to add new manager
   * @param _manager address New manager
   */
  function enableManager(address _manager) external onlyOwner onlyValidAddress(_manager) {
    require(managerEnabled[_manager] == false);

    managerEnabled[_manager] = true;
    ManagerEnabledEvent(_manager);
  }

  /**
   * @dev Function to remove existing manager
   * @param _manager address Existing manager
   */
  function disableManager(address _manager) external onlyOwner onlyValidAddress(_manager) {
    require(managerEnabled[_manager] == true);

    managerEnabled[_manager] = false;
    ManagerDisabledEvent(_manager);
  }

  /**
   * @dev Function to grant new permission to the manager
   * @param _manager        address Existing manager
   * @param _permissionName string  Granted permission name
   */
  function grantManagerPermission(
    address _manager, string _permissionName
  )
    external
    onlyOwner
    onlyValidAddress(_manager)
    onlyValidPermissionName(_permissionName)
  {
    require(managerPermissions[_manager][_permissionName] == false);

    managerPermissions[_manager][_permissionName] = true;
    ManagerPermissionGrantedEvent(_manager, _permissionName);
  }

  /**
   * @dev Function to revoke permission of the manager
   * @param _manager        address Existing manager
   * @param _permissionName string  Revoked permission name
   */
  function revokeManagerPermission(
    address _manager, string _permissionName
  )
    external
    onlyOwner
    onlyValidAddress(_manager)
    onlyValidPermissionName(_permissionName)
  {
    require(managerPermissions[_manager][_permissionName] == true);

    managerPermissions[_manager][_permissionName] = false;
    ManagerPermissionRevokedEvent(_manager, _permissionName);
  }


  /* Getters */

  /**
   * @dev Function to check manager status
   * @param _manager address Manager`s address
   * @return True if manager is enabled
   */
  function isManagerEnabled(address _manager) public constant onlyValidAddress(_manager) returns (bool) {
    return managerEnabled[_manager];
  }

  /**
   * @dev Function to check permissions of a manager
   * @param _manager        address Manager`s address
   * @param _permissionName string  Permission name
   * @return True if manager has been granted needed permission
   */
  function isPermissionGranted(
    address _manager, string _permissionName
  )
    public
    constant
    onlyValidAddress(_manager)
    onlyValidPermissionName(_permissionName)
    returns (bool)
  {
    return managerPermissions[_manager][_permissionName];
  }

  /**
   * @dev Function to check if the manager can perform the action or not
   * @param _manager        address Manager`s address
   * @param _permissionName string  Permission name
   * @return True if manager is enabled and has been granted needed permission
   */
  function isManagerAllowed(
    address _manager, string _permissionName
  )
    public
    constant
    onlyValidAddress(_manager)
    onlyValidPermissionName(_permissionName)
    returns (bool)
  {
    return (managerEnabled[_manager] && managerPermissions[_manager][_permissionName]);
  }


  /* Helpers */

  /**
   * @dev Modifier to check manager address
   */
  modifier onlyValidAddress(address _manager) {
    require(_manager != address(0x0));
    _;
  }

  /**
   * @dev Modifier to check name of manager permission
   */
  modifier onlyValidPermissionName(string _permissionName) {
    require(bytes(_permissionName).length != 0);
    _;
  }


  /* Outcome */

  /**
   * @dev Modifier to use in derived contracts
   */
  modifier onlyAllowedManager(string _permissionName) {
    require(isManagerAllowed(msg.sender, _permissionName) == true);
    _;
  }
}
