import { submitTxAndWaitConfirmation } from '../../misc/SubmitTx';

const Promise = require('bluebird');

const CrydrControllerLicensedBaseInterface = global.artifacts.require('CrydrControllerLicensedBaseInterface.sol');

const ManageableJSAPI = require('../../lifecycle/Manageable');


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
    CrydrControllerLicensedBaseInterface
      .at(crydrControllerAddress)
      .setLicenseRegistry
      .sendTransaction,
    [licenseRegistryAddress, { from: managerAddress }]);
  global.console.log('\tLicense registry of CryDR controller successfully set');
};

export const getLicenseRegistryAddress = async (licenseRegistryAddress) =>
  CrydrControllerLicensedBaseInterface.at(licenseRegistryAddress).getLicenseRegistryAddress.call();


/**
 * Events
 */

export const getCrydrControllerChangedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrControllerLicensedBaseInterface
    .at(contractAddress)
    .LicenseRegistryChangedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};


/**
 * Permissions
 */

export const grantManagerPermissions = async (crydrControllerAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for licensed crydr controller ...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'set_license_registry',
  ];

  await ManageableJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                ownerAddress,
                                                managerAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to the manager of licensed crydr controller granted');
  return null;
};
