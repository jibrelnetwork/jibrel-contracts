import { submitTxAndWaitConfirmation } from '../../../util/SubmitTx';

const Promise = require('bluebird');

const CrydrStorageBaseInterface = global.artifacts.require('CrydrStorageBaseInterface.sol');

const ManageableJSAPI = require('../../lifecycle/Manageable');


/**
 * Configuration
 */

export const setCrydrController = async (crydrStorageAddress, managerAddress,
                                         crydrControllerAddress) => {
  global.console.log('\tSet controller of CryDR storage:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  await submitTxAndWaitConfirmation(
    CrydrStorageBaseInterface
      .at(crydrStorageAddress)
      .setCrydrController
      .sendTransaction,
    [crydrControllerAddress, { from: managerAddress }]);
  global.console.log('\tController of CryDR storage successfully set');
};

export const getCrydrController = async (crydrStorageAddress) =>
  CrydrStorageBaseInterface.at(crydrStorageAddress).getCrydrController.call();


/**
 * Events
 */

export const getCrydrControllerChangedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBaseInterface
    .at(contractAddress)
    .CrydrControllerChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};


/**
 * Permissions
 */

export const grantManagerPermissions = async (crydrControllerAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for crydr storage ...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanager - ${managerAddress}`);

  const managerPermissions = [
    'set_crydr_controller',
  ];

  await ManageableJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                ownerAddress,
                                                managerAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to the manager of crydr storage granted');
  return null;
};

