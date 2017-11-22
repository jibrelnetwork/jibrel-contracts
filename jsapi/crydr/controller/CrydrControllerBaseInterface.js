import { submitTxAndWaitConfirmation } from '../../misc/SubmitTx';

const Promise = require('bluebird');

const CrydrControllerBaseInterface = global.artifacts.require('CrydrControllerBaseInterface.sol');

const ManageableJSAPI = require('../../lifecycle/Manageable');


/* Configuration */

export const setCrydrStorage = async (crydrControllerAddress, managerAddress,
                                      crydrStorageAddress) => {
  global.console.log('\tSet storage of CryDR controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerBaseInterface
      .at(crydrControllerAddress)
      .setCrydrStorage
      .sendTransaction,
    [crydrStorageAddress, { from: managerAddress }]);
  global.console.log('\tStorage of CryDR controller successfully set');
  return null;
};

export const getCrydrStorage = async (contractAddress) =>
  CrydrControllerBaseInterface.at(contractAddress).getCrydrStorage.call();


export const setCrydrView = async (crydrControllerAddress, managerAddress,
                                   crydrViewAddress, crydrViewApiStandardName) => {
  global.console.log('\tSet view of CryDR controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tcrydrViewApiStandardName - ${crydrViewApiStandardName}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerBaseInterface
      .at(crydrControllerAddress)
      .setCrydrView
      .sendTransaction,
    [crydrViewApiStandardName, crydrViewAddress, { from: managerAddress }]);
  global.console.log('\tView of CryDR controller successfully set');
  return null;
};

export const removeCrydrView = async (crydrControllerAddress, managerAddress,
                                      viewApiStandardName) => {
  global.console.log('\tRemove view of CryDR controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tviewApiStandardName - ${viewApiStandardName}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerBaseInterface
      .at(crydrControllerAddress)
      .removeCrydrView
      .sendTransaction,
    [viewApiStandardName, { from: managerAddress }]);
  global.console.log('\tView of CryDR controller successfully removed');
  return null;
};

export const getCrydrView = async (contractAddress) =>
  CrydrControllerBaseInterface.at(contractAddress).getCrydrView.call();


/**
 * Events
 */

export const getCrydrStorageChangedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrControllerBaseInterface
    .at(contractAddress)
    .CrydrStorageChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getCrydrViewAddedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrControllerBaseInterface
    .at(contractAddress)
    .CrydrViewAddedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getCrydrViewRemovedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrControllerBaseInterface
    .at(contractAddress)
    .CrydrViewRemovedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};


/**
 * Permissions
 */

export const grantManagerPermissions = async (crydrControllerAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for crydr controller ...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'set_crydr_storage',
    'set_crydr_view',
    'remove_crydr_view',
  ];

  await ManageableJSAPI.grantManagerPermissions(crydrControllerAddress, ownerAddress, managerAddress, managerPermissions);

  global.console.log('\tPermissions to the manager of crydr controller granted');
  return null;
};
