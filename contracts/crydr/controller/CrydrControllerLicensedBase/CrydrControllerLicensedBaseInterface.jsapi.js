import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const CrydrControllerLicensedBaseInterfaceArtifact = global.artifacts.require('CrydrControllerLicensedBaseInterface.sol');


/**
 * Configuration
 */

export const setLicenseRegistry = async (crydrControllerAddress, managerAddress,
                                         licenseRegistryAddress) => {
  global.console.log('\tSet license registry for the controller:');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerLicensedBaseInterfaceArtifact
      .at(crydrControllerAddress)
      .setLicenseRegistry
      .sendTransaction,
    [licenseRegistryAddress, { from: managerAddress }]);
  global.console.log('\tLicense registry of CryDR controller successfully set');
};

export const getLicenseRegistryAddress = async (licenseRegistryAddress) =>
  CrydrControllerLicensedBaseInterfaceArtifact.at(licenseRegistryAddress).getLicenseRegistryAddress.call();


/**
 * Events
 */

export const getLicenseRegistryChangedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrControllerLicensedBaseInterfaceArtifact
    .at(contractAddress)
    .LicenseRegistryChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
