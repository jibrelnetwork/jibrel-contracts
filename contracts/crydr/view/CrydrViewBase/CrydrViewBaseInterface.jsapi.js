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
  await submitTxAndWaitConfirmation(
    CrydrViewBaseInterfaceArtifact
      .at(crydrViewAddress)
      .setCrydrController
      .sendTransaction,
    [crydrControllerAddress],
    { from: managerAddress }
  );
  global.console.log('\tController of crydr view successfully set');
  return null;
};

export const getCrydrController = async (contractAddress) =>
  CrydrViewBaseInterfaceArtifact.at(contractAddress).getCrydrController.call();

export const getCrydrViewStandardName = async (contractAddress) =>
  CrydrViewBaseInterfaceArtifact.at(contractAddress).getCrydrViewStandardName.call();

export const getCrydrViewStandardNameHash = async (contractAddress) =>
  CrydrViewBaseInterfaceArtifact.at(contractAddress).getCrydrViewStandardNameHash.call();


/**
 * Events
 */

export const getCrydrControllerChangedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrViewBaseInterfaceArtifact
    .at(contractAddress)
    .CrydrControllerChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
