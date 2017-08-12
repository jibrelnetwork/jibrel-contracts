import { submitTxAndWaitConfirmation } from './utils/SubmitTx';

const Promise = require('bluebird');

const Manageable = global.artifacts.require('Manageable.sol');


/**
 * Setters
 */

export const enableManager = async (contractAddress, owner, manager) => {
  global.console.log('\tEnable manager of a contract:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanager - ${manager}`);
  await submitTxAndWaitConfirmation(
    Manageable
      .at(contractAddress)
      .enableManager
      .sendTransaction,
    [manager, { from: owner }]);
  global.console.log('\tManager successfully enabled');
};

export const disableManager = async (contractAddress, owner, manager) => {
  global.console.log('\tDisable manager of a contract:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanager - ${manager}`);
  await submitTxAndWaitConfirmation(
    Manageable
      .at(contractAddress)
      .disableManager
      .sendTransaction,
    [manager, { from: owner }]);
  global.console.log('\tManager successfully disabled');
};

export const grantManagerPermissions = async (contractAddress, owner, manager, permissionsList) => {
  global.console.log('\tGrant manager permissions:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tpermissions - ${JSON.stringify(permissionsList)}`);
  await Promise.all(
    permissionsList.map((permissionName) =>
                          submitTxAndWaitConfirmation(
                            Manageable
                              .at(contractAddress)
                              .grantManagerPermission
                              .sendTransaction,
                            [manager, permissionName, { from: owner }])));
  global.console.log('\tPermissions to the manager successfully granted');
};

export const revokeManagerPermissions = async (contractAddress, owner, manager, permissionsList) => {
  global.console.log('\tRevoke manager permissions:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tpermissions - ${JSON.stringify(permissionsList)}`);
  await Promise.all(
    permissionsList.map((permissionName) =>
                          submitTxAndWaitConfirmation(
                            Manageable
                              .at(contractAddress)
                              .revokeManagerPermission
                              .sendTransaction,
                            [manager, permissionName, { from: owner }])));
  global.console.log('\tPermissions to the manager successfully revoked');
};


/**
 * Getters
 */

export const isManagerEnabled = (contractAddress, manager) => {
  global.console.log('\tGet whether manager is enabled');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  return Manageable
    .at(contractAddress)
    .isManagerEnabled
    .call(manager);
};

export const isPermissionGranted = (contractAddress, manager, permissionName) => {
  global.console.log('\tGet whether manager is granted with permission');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tpermissionName - ${permissionName}`);
  return Manageable
    .at(contractAddress)
    .isPermissionGranted
    .call(manager, permissionName);
};

export const isManagerAllowed = (contractAddress, manager, permissionName) => {
  global.console.log('\tGet whether manager is allowed to make an action');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tpermissionName - ${permissionName}`);
  return Manageable
    .at(contractAddress)
    .isManagerAllowed
    .call(manager, permissionName);
};


/**
 * Events
 */

export const getManagerEnabledEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = Manageable.at(contractAddress).ManagerEnabledEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getManagerDisabledEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = Manageable.at(contractAddress).ManagerDisabledEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getManagerPermissionGrantedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = Manageable.at(contractAddress).ManagerPermissionGrantedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getManagerPermissionRevokedEvents = (contractAddress, eventDataFilter, commonFilter) => {
  const eventObj = Manageable.at(contractAddress).ManagerPermissionRevokedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
