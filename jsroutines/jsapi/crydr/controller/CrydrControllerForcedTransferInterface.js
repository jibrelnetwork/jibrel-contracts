import { submitTxAndWaitConfirmation } from '../../misc/SubmitTx';

const Promise = require('bluebird');

const CrydrControllerForcedTransferInterface = global.artifacts.require('CrydrControllerForcedTransferInterface.sol');

const ManageableJSAPI = require('../../lifecycle/Manageable');


/**
 * Methods
 */

export const forcedTransfer = async (crydrControllerAddress, callerAddress,
                                     fromAddress, toAddress, valueToTransfer) => {
  global.console.log('\tForced transfer of funds via CryDR Controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tcallerAddress - ${callerAddress}`);
  global.console.log(`\t\tfromAddress - ${fromAddress}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  global.console.log(`\t\tvalueToTransfer - ${valueToTransfer}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerForcedTransferInterface
      .at(crydrControllerAddress)
      .forcedTransfer
      .sendTransaction,
    [fromAddress, toAddress, valueToTransfer, { from: callerAddress }]);
  global.console.log('\tFunds successfully transferred via CryDR Controller');
  return null;
};


export const forcedTransferAll = async (crydrControllerAddress, callerAddress,
                                        fromAddress, toAddress) => {
  global.console.log('\tForced transfer of all funds via CryDR Controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tcallerAddress - ${callerAddress}`);
  global.console.log(`\t\tfromAddress - ${fromAddress}`);
  global.console.log(`\t\ttoAddress - ${toAddress}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerForcedTransferInterface
      .at(crydrControllerAddress)
      .forcedTransferAll
      .sendTransaction,
    [fromAddress, toAddress, { from: callerAddress }]);
  global.console.log('\tFunds successfully transferred via CryDR Controller');
  return null;
};


/**
 * Events
 */

export const getCrydrStorageChangedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrControllerForcedTransferInterface
    .at(contractAddress)
    .ForcedTransferEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};


/**
 * Permissions
 */

export const grantManagerPermissions = async (crydrControllerAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for mintable crydr controller ...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'forced_transfer',
  ];

  await ManageableJSAPI.grantManagerPermissions(crydrControllerAddress, ownerAddress, managerAddress, managerPermissions);

  global.console.log('\tPermissions to the manager of ForcedTransfer crydr controller granted');
  return null;
};
