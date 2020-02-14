import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const CrydrStorageBaseInterfaceArtifact = global.artifacts.require('CrydrStorageBaseInterface.sol');


/**
 * Configuration
 */

export const setCrydrController = async (crydrStorageAddress, managerAddress,
                                         crydrControllerAddress) => {
  global.console.log('\tSet controller of CryDR storage:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrStorageBaseInterfaceArtifact
  //     .at(crydrStorageAddress)
  //     .setCrydrController
  //     .sendTransaction,
  //   [crydrControllerAddress],
  //   { from: managerAddress }
  // );
  const instance = await CrydrStorageBaseInterfaceArtifact.at(crydrStorageAddress);
  await instance.setCrydrController(crydrControllerAddress, { from: managerAddress });
  global.console.log('\tController of CryDR storage successfully set');
};


export const getCrydrController = async (crydrStorageAddress) => {
  const i = await CrydrStorageBaseInterfaceArtifact.at(crydrStorageAddress)
  return await i.getCrydrController();
}


/**
 * Events
 */

export const getCrydrControllerChangedEvents = async (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  // const eventObj = CrydrStorageBaseInterfaceArtifact
  //   .at(contractAddress)
  //   .CrydrControllerChangedEvent(eventDataFilter, commonFilter);
  // const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  // return eventGet();
  const filter = commonFilter;
  filter.filter = eventDataFilter;
  const i = await CrydrStorageBaseInterfaceArtifact.at(contractAddress);
  const events = await i.getPastEvents('CrydrControllerChangedEvent', filter);
  return events;
};
