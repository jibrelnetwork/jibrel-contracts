import { submitTxAndWaitConfirmation } from '../../misc/SubmitTx';

const Promise = require('bluebird');

const CrydrViewBaseInterface = global.artifacts.require('CrydrViewBaseInterface.sol');

const ManageableJSAPI = require('../../lifecycle/Manageable');


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
    CrydrViewBaseInterface
      .at(crydrViewAddress)
      .setCrydrController
      .sendTransaction,
    [crydrControllerAddress, { from: managerAddress }]);
  global.console.log('\tController of crydr view successfully set');
  return null;
};

export const getCrydrController = async (contractAddress) =>
  CrydrViewBaseInterface.at(contractAddress).getCrydrController.call();

export const getCrydrViewStandardName = async (contractAddress) =>
  CrydrViewBaseInterface.at(contractAddress).getCrydrViewStandardName.call();

export const getCrydrViewStandardNameHash = async (contractAddress) =>
  CrydrViewBaseInterface.at(contractAddress).getCrydrViewStandardNameHash.call();


/**
 * Events
 */

export const getCrydrControllerChangedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrViewBaseInterface
    .at(contractAddress)
    .CrydrControllerChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};


/**
 * Permissions
 */

export const grantManagerPermissions = async (jntViewAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for crydr view ...');
  global.console.log(`\t\tjntViewAddress - ${jntViewAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'set_crydr_controller',
  ];

  await ManageableJSAPI.grantManagerPermissions(jntViewAddress, ownerAddress, managerAddress, managerPermissions);

  global.console.log('\tPermissions to the manager of crydr view granted');
  return null;
};
