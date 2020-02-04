import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const CrydrControllerBaseInterfaceArtifact = global.artifacts.require('CrydrControllerBaseInterface.sol');
const CrydrControllerBaseArtifact = global.artifacts.require('CrydrControllerBase.sol');

const sleep = require('sleep-promise');

/* Configuration */

export const setCrydrStorage = async (crydrControllerAddress, managerAddress,
                                      crydrStorageAddress) => {
  global.console.log('\tSet storage of CryDR controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrControllerBaseInterfaceArtifact
  //     .at(crydrControllerAddress)
  //     .setCrydrStorage
  //     .sendTransaction,
  //   [crydrStorageAddress],
  //   { from: managerAddress }
  // );
  const instance = await CrydrControllerBaseInterfaceArtifact.at(crydrControllerAddress);
  const c = await CrydrControllerBaseArtifact.at(crydrControllerAddress);
  try {
    // let mr = await c.isManagerAllowed(managerAddress, "set_crydr_storage");
    // await sleep(10000);
    global.console.log('\tFOO', crydrControllerAddress, crydrStorageAddress, managerAddress);
    await instance.setCrydrStorage(crydrStorageAddress, { from: managerAddress });
    global.console.log('\tBAR');

  } catch (e) {
    global.console.log('\tStorage of CryDR controller setting error:', e);
    // throw e;
  }
  global.console.log('\tStorage of CryDR controller successfully set');
  return null;
};

export const getCrydrStorageAddress = async (contractAddress) => {
  global.console.log('\tFetch address of CrydrStorage configure in crydr controller');
  const result = await CrydrControllerBaseInterfaceArtifact.at(contractAddress).getCrydrStorageAddress.call();
  global.console.log(`\t\tFetched address: ${result}`);
  return result;
};


export const setCrydrView = async (crydrControllerAddress, managerAddress,
                                   crydrViewAddress, crydrViewStandardName) => {
  global.console.log('\tSet view of CryDR controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tcrydrViewStandardName - ${crydrViewStandardName}`);

  // await submitTxAndWaitConfirmation(
  //   CrydrControllerBaseInterfaceArtifact
  //     .at(crydrControllerAddress)
  //     .setCrydrView
  //     .sendTransaction,
  //   [crydrViewAddress, crydrViewStandardName],
  //   { from: managerAddress }
  // );
  const instance = await CrydrControllerBaseInterfaceArtifact.at(crydrControllerAddress);
  await instance.setCrydrView(crydrViewAddress, crydrViewStandardName, { from: managerAddress });
  global.console.log('\tView of CryDR controller successfully set');
  return null;
};

export const removeCrydrView = async (crydrControllerAddress, managerAddress,
                                      viewApiStandardName) => {
  global.console.log('\tRemove view of CryDR controller:');
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tviewApiStandardName - ${viewApiStandardName}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrControllerBaseInterfaceArtifact
  //     .at(crydrControllerAddress)
  //     .removeCrydrView
  //     .sendTransaction,
  //   [viewApiStandardName],
  //   { from: managerAddress }
  // );
  const instance = await CrydrControllerBaseInterfaceArtifact.at(crydrControllerAddress);
  await instance.removeCrydrView(viewApiStandardName, { from: managerAddress });
  global.console.log('\tView of CryDR controller successfully removed');
  return null;
};

export const getCrydrViewAddress = async (contractAddress, standardName) => {
  global.console.log('\tFetch address of CrydrView configure in crydr controller');
  const result = await CrydrControllerBaseInterfaceArtifact.at(contractAddress).getCrydrViewAddress.call(standardName);
  global.console.log(`\t\tFetched address: ${result}`);
  return result;
};


export const isCrydrViewAddress = async (contractAddress, crydrViewAddress) => {
  global.console.log('\tFetch whether address is an crydr view contract');
  const result = await CrydrControllerBaseInterfaceArtifact.at(contractAddress).isCrydrViewAddress.call(crydrViewAddress);
  global.console.log(`\t\tFetched result: ${result}`);
  return result;
};

export const isCrydrViewRegistered = async (contractAddress, viewApiStandardName) => {
  global.console.log('\tFetch whether view with given standard name exists');
  const result = await CrydrControllerBaseInterfaceArtifact.at(contractAddress).isCrydrViewRegistered.call(viewApiStandardName);
  global.console.log(`\t\tFetched result: ${result}`);
  return result;
};


/**
 * Events
 */

export const getCrydrStorageChangedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrControllerBaseInterfaceArtifact
    .at(contractAddress)
    .CrydrStorageChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getCrydrViewAddedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrControllerBaseInterfaceArtifact
    .at(contractAddress)
    .CrydrViewAddedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getCrydrViewRemovedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrControllerBaseInterfaceArtifact
    .at(contractAddress)
    .CrydrViewRemovedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
