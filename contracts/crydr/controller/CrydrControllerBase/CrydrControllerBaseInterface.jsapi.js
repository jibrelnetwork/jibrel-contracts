import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const CrydrControllerBaseInterfaceArtifact = global.artifacts.require('CrydrControllerBaseInterface.sol');
const CrydrControllerBaseArtifact = global.artifacts.require('CrydrControllerBase.sol');


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

  await instance.setCrydrStorage(crydrStorageAddress, { from: managerAddress });
  global.console.log('\tStorage of CryDR controller successfully set');
  return null;
};

export const getCrydrStorageAddress = async (contractAddress) => {
  global.console.log('\tFetch address of CrydrStorage configure in crydr controller');
  const i = await CrydrControllerBaseInterfaceArtifact.at(contractAddress);
  const result = await i.getCrydrStorageAddress();
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
  const i = await CrydrControllerBaseInterfaceArtifact.at(contractAddress);
  const result = i.getCrydrViewAddress(standardName);
  global.console.log(`\t\tFetched address: ${result}`);
  return result;
};


export const isCrydrViewAddress = async (contractAddress, crydrViewAddress) => {
  global.console.log('\tFetch whether address is an crydr view contract');
  const i = await CrydrControllerBaseInterfaceArtifact.at(contractAddress);
  const result = i.isCrydrViewAddress.call(crydrViewAddress);
  global.console.log(`\t\tFetched result: ${result}`);
  return result;
};

export const isCrydrViewRegistered = async (contractAddress, viewApiStandardName) => {
  global.console.log('\tFetch whether view with given standard name exists');
  const i = await CrydrControllerBaseInterfaceArtifact.at(contractAddress);
  const result = i.isCrydrViewRegistered.call(viewApiStandardName);
  global.console.log(`\t\tFetched result: ${result}`);
  return result;
};


/**
 * Events
 */

export const getCrydrStorageChangedEvents = async (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  // const eventObj = CrydrControllerBaseInterfaceArtifact
  //   .at(contractAddress)
  //   .CrydrStorageChangedEvent(eventDataFilter, commonFilter);
  // const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  // return eventGet();
  const filter = commonFilter;
  filter.filter = eventDataFilter;
  const i = await CrydrControllerBaseInterfaceArtifact.at(contractAddress);
  const events = await i.getPastEvents('CrydrStorageChangedEvent', filter);
  return events;
};

export const getCrydrViewAddedEvents = async (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  // const eventObj = CrydrControllerBaseInterfaceArtifact
  //   .at(contractAddress)
  //   .CrydrViewAddedEvent(eventDataFilter, commonFilter);
  // const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  // return eventGet();
  const filter = commonFilter;
  filter.filter = eventDataFilter;
  const i = await CrydrControllerBaseInterfaceArtifact.at(contractAddress);
  const events = await i.getPastEvents('CrydrViewAddedEvent', filter);
  return events;
};

export const getCrydrViewRemovedEvents = async (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  // const eventObj = CrydrControllerBaseInterfaceArtifact
  //   .at(contractAddress)
  //   .CrydrViewRemovedEvent(eventDataFilter, commonFilter);
  // const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  // return eventGet();
  const filter = commonFilter;
  filter.filter = eventDataFilter;
  const i = await CrydrControllerBaseInterfaceArtifact.at(contractAddress);
  const events = await i.getPastEvents('CrydrViewRemovedEvent', filter);
  return events;
};
