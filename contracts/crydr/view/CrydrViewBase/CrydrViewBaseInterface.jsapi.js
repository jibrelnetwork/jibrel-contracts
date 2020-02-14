import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const CrydrViewBaseInterfaceArtifact = global.artifacts.require('CrydrViewBaseInterface.sol');


/**
 * Configuration
 */

export const setCrydrController = async (crydrViewAddress, managerAddress,
                                         crydrControllerAddress) => {
  global.console.log('\tSet controller of crydr view:');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrViewBaseInterfaceArtifact
  //     .at(crydrViewAddress)
  //     .setCrydrController
  //     .sendTransaction,
  //   [crydrControllerAddress],
  //   { from: managerAddress }
  // );
  const instance = await CrydrViewBaseInterfaceArtifact.at(crydrViewAddress);
  await instance.setCrydrController(crydrControllerAddress, { from: managerAddress });
  global.console.log('\tController of crydr view successfully set');
  return null;
};

export const getCrydrController = async (contractAddress) => {
  const i = await CrydrViewBaseInterfaceArtifact.at(contractAddress);
  return await i.getCrydrController();
}

export const getCrydrViewStandardName = async (contractAddress) => {
  const i = await CrydrViewBaseInterfaceArtifact.at(contractAddress);
  return await i.getCrydrViewStandardName();
}

export const getCrydrViewStandardNameHash = async (contractAddress) => {
  const i = await CrydrViewBaseInterfaceArtifact.at(contractAddress);
  return await i.getCrydrViewStandardNameHash();
}


/**
 * Events
 */

export const getCrydrControllerChangedEvents = async (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  // const eventObj = CrydrViewBaseInterfaceArtifact
  //   .at(contractAddress)
  //   .CrydrControllerChangedEvent(eventDataFilter, commonFilter);
  // const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  // return eventGet();
  const filter = commonFilter;
  filter.filter = eventDataFilter;
  const i = await CrydrViewBaseInterfaceArtifact.at(contractAddress);
  const events = await i.getPastEvents('CrydrControllerChangedEvent', filter);
  return events;
};
