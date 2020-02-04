import { submitTxAndWaitConfirmation } from '../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const ManageableArtifact = global.artifacts.require('Manageable.sol');


/**
 * Setters
 */

export const enableManager = async (contractAddress, ownerAddress,
                                    managerAddress) => {
  global.console.log('\tEnable manager of a contract:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  // await submitTxAndWaitConfirmation(
  //   ManageableArtifact
  //     .at(contractAddress)
  //     .enableManager
  //     .sendTransaction,
  //   [managerAddress],
  //   { from: ownerAddress }
  // );
  // const instance = await ManageableArtifact.deployed();
  const instance = await ManageableArtifact.at(contractAddress);
  await instance.enableManager(managerAddress,  {from: ownerAddress });
  global.console.log('\tManager successfully enabled, DI ${instance}');
};

export const disableManager = async (contractAddress, ownerAddress,
                                     managerAddress) => {
  global.console.log('\tDisable manager of a contract:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  // await submitTxAndWaitConfirmation(
  //   ManageableArtifact
  //     .at(contractAddress)
  //     .disableManager
  //     .sendTransaction,
  //   [managerAddress],
  //   { from: ownerAddress }
  // );
  const instance = await ManageableArtifact.at(contractAddress);
  await instance.disableManager(managerAddress,  {from: ownerAddress });
  global.console.log('\tManager successfully disabled');
};

export const grantManagerPermissions = async (contractAddress, ownerAddress,
                                              managerAddress, permissionsList) => {
  global.console.log('\tGrant manager permissions:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tpermissions - ${JSON.stringify(permissionsList)}`);
  // await Promise.all(
    // permissionsList.map((permissionName) =>
    //                       submitTxAndWaitConfirmation(
    //                         ManageableArtifact
    //                           .at(contractAddress)
    //                           .grantManagerPermission
    //                           .sendTransaction,
    //                         [managerAddress, permissionName],
    //                         { from: ownerAddress }
    //                       )));
  // const instance = await ManageableArtifact.deployed();
  const instance = await ManageableArtifact.at(contractAddress);
  for(let i = 0; i < permissionsList.length; i++){
    const permissionName = permissionsList[i];
    await instance.grantManagerPermission(managerAddress, permissionName,  {from: ownerAddress});
  }
  global.console.log('\tPermissions to the manager successfully granted');
};

export const revokeManagerPermissions = async (contractAddress, ownerAddress,
                                               managerAddress, permissionsList) => {
  global.console.log('\tRevoke manager permissions:');
  global.console.log(`\t\tcontractAddress - ${contractAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tpermissions - ${JSON.stringify(permissionsList)}`);
  // await Promise.all(
  //   permissionsList.map((permissionName) =>
  //                         submitTxAndWaitConfirmation(
  //                           ManageableArtifact
  //                             .at(contractAddress)
  //                             .revokeManagerPermission
  //                             .sendTransaction,
  //                           [managerAddress, permissionName],
  //                           { from: ownerAddress }
  //                         ))
  // );

  const instance = await ManageableArtifact.at(contractAddress);
  for(let i = 0; i < permissionsList.length; i++){
    const permissionName = permissionsList[i];
    await instance.revokeManagerPermission(managerAddress, permissionName,  {from: ownerAddress});
  }
  global.console.log('\tPermissions to the manager successfully revoked');
};


/**
 * Getters
 */

export const isManagerEnabled = async (contractAddress, manager) => {
  const instance = await ManageableArtifact.at(contractAddress);
  await instance.isManagerEnabled(manager);
}


export const isPermissionGranted = async (contractAddress, manager, permissionName) => {
  const instance = await ManageableArtifact.at(contractAddress);
  await instance.isPermissionGranted(manager, permissionName);
}


/**
 * Events
 */

export const getManagerEnabledEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = ManageableArtifact.at(contractAddress).ManagerEnabledEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getManagerDisabledEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = ManageableArtifact.at(contractAddress).ManagerDisabledEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getManagerPermissionGrantedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = ManageableArtifact.at(contractAddress).ManagerPermissionGrantedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getManagerPermissionRevokedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = ManageableArtifact.at(contractAddress).ManagerPermissionRevokedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
