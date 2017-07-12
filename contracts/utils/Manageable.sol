pragma solidity ^0.4.11;


/* Author: Victor Mezrin  victor@mezrin.com */


import "../zeppelin/ownership/Ownable.sol";


/**
 * @title Manageable
 * @dev Contract that allows to grant permissions to any address
 */
contract Manageable is Ownable {
  mapping (address => bool) managerEnabled;
  mapping (address => mapping (string => bool)) managerPermissions;

  event ManagerEnabledEvent(address indexed manager);
  event ManagerDisabledEvent(address indexed manager);
  event ManagerPermissionGrantedEvent(address indexed manager, string indexed permission);
  event ManagerPermissionRevokedEvent(address indexed manager, string indexed permission);


  /* Configure contract */

  /**
   * @dev Function to add new manager
   * @param _manager address New manager
   */
  function enableManager(address _manager) onlyOwner onlyValidAddress(_manager) {
    if (managerEnabled[_manager]) {
      return;
    }
    managerEnabled[_manager] = true;
    ManagerEnabledEvent(_manager);
  }

  /**
   * @dev Function to remove existing manager
   * @param _manager address Existing manager
   */
  function disableManager(address _manager) onlyOwner onlyValidAddress(_manager) {
    if (managerEnabled[_manager] == false) {
      return;
    }
    managerEnabled[_manager] = false;
    ManagerDisabledEvent(_manager);
  }

  /**
   * @dev Function to grant new permission to the existing manager
   * @param _manager        address Existing manager
   * @param _permissionName string  Granted permission name
   */
  function grantManagerPermission(
    address _manager, string _permissionName
  )
    onlyOwner
    onlyValidAddress(_manager)
    onlyValidPermissionName(_permissionName)
  {
    if (managerPermissions[_manager][_permissionName]) {
      return;
    }
    managerPermissions[_manager][_permissionName] = true;
    ManagerPermissionGrantedEvent(_manager, _permissionName);
  }

  /**
   * @dev Function to cancel permission of the existing manager
   * @param _manager        address Existing manager
   * @param _permissionName string  Revoked permission name
   */
  function revokeManagerPermission(
    address _manager, string _managerPermission
  )
    onlyOwner
    onlyValidAddress(_manager)
    onlyValidPermissionName(_permissionName)
  {
    if (managerPermissions[_manager][_permissionName] == false) {
      return;
    }
    managerPermissions[_manager][_permissionName] = false;
    ManagerPermissionRevokedEvent(_manager, _permissionName);
  }


  /* Getters */

  /**
   * @dev Function to check manager status
   * @param _manager address Manager`s address
   * @return True if manager is enabled
   */
  function isManagerEnabled(address _manager) constant onlyValidAddress(_manager) returns (bool) {
    return managerEnabled[_manager];
  }

  /**
   * @dev Function to check permissions of a manager
   * @param _manager        address Manager`s address
   * @param _permissionName string  Permission name
   * @return True if manager has been granted needed permission
   */
  function isLicenseObtained(
    address _manager, string _permissionName
  )
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
    require(_manager != 0x0);
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
  modifier onlyManager(string _permissionName) {
    require(isManagerAllowed(msg.sender, _permissionName) == true);
    _;
  }
}
