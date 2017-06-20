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
  event ManagerPermissionCancelledEvent(address indexed manager, string indexed permission);

  /**
   * @dev Function to add new manager
   * @param _manager address New manager
   */
  function enableManager(address _manager) onlyOwner checkManagerAddress(_manager) {
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
  function disableManager(address _manager) onlyOwner checkManagerAddress(_manager) {
    if (managerEnabled[_manager] == false) {
      return;
    }
    managerEnabled[_manager] = false;
    ManagerDisabledEvent(_manager);
  }

  /**
   * @dev Function to grant new permission to the existing manager
   * @param _manager           address Existing manager
   * @param _managerPermission string  Granted permission
   */
  function grantManagerPermission(
    address _manager, string _managerPermission
  )
    onlyOwner
    checkManagerAddress(_manager)
    checkManagerPermissionName(_managerPermission)
  {
    if (managerPermissions[_manager][_managerPermission]) {
      return;
    }
    managerPermissions[_manager][_managerPermission] = true;
    ManagerPermissionGrantedEvent(_manager, _managerPermission);
  }

  /**
   * @dev Function to cancel permission of the existing manager
   * @param _manager           address Existing manager
   * @param _managerPermission string  Cancelled permission
   */
  function cancelManagerPermission(
    address _manager, string _managerPermission
  )
    onlyOwner
    checkManagerAddress(_manager)
    checkManagerPermissionName(_managerPermission)
  {
    if (bytes(_managerPermission).length == 0) {
      throw;
    }
    if (managerPermissions[_manager][_managerPermission] == false) {
      return;
    }
    managerPermissions[_manager][_managerPermission] = false;
    ManagerPermissionCancelledEvent(_manager, _managerPermission);
  }

  /**
   * @dev Function to check manager status
   * @param _manager address Manager`s address
   * @return True if manager is enabled
   */
  function isManagerEnabled(address _manager) constant checkManagerAddress(_manager) returns (bool result) {
    if (_manager == 0x0) {
      return false;
    }
    if (managerEnabled[_manager] == false) {
      return false;
    }
    return true;
  }

  /**
   * @dev Function to check permissions of a manager
   * @param _manager           address Manager`s address
   * @param _managerPermission string  Permission name
   * @return True if manager has been granted needed permission
   */
  function isManagerAllowed(
    address _manager, string _managerPermission
  )
    constant
    checkManagerAddress(_manager)
    checkManagerPermissionName(_managerPermission)
    returns (bool result)
  {
    if (isManagerEnabled(_manager) == false) {
      return false;
    }
    if (bytes(_managerPermission).length == 0) {
      return false;
    }
    if (managerPermissions[_manager][_managerPermission] == false) {
      return false;
    }
    return true;
  }

  /**
   * @dev Modifier to use in derived contracts
   */
  modifier onlyManager(string _permissionName) {
    if (isManagerAllowed(msg.sender, _permissionName) != true) {
      throw;
    }
    _;
  }

  /**
   * @dev Modifier to check manager address
   */
  modifier checkManagerAddress(address _manager) {
    if (_manager == 0x0) {
      throw;
    }
    _;
  }

  /**
   * @dev Modifier to check name of manager permission
   */
  modifier checkManagerPermissionName(string _permissionName) {
    if (bytes(_permissionName).length == 0) {
      throw;
    }
    _;
  }
}
