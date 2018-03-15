import { submitTxAndWaitConfirmation } from '../../misc/SubmitTx';

const CrydrControllerLicensedBaseInterface = global.artifacts.require('CrydrControllerLicensedBaseInterface.sol');

const ManageableJSAPI = require('../../lifecycle/Manageable');


/**
 * Configuration
 */

export const setMetadata = async (crydrViewAddress, managerAddress,
                                  metadataKey, metadataValue) => {
  global.console.log('\tSet crydr view metadata:');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);
  global.console.log(`\t\tmetadataKey - ${metadataKey}`);
  global.console.log(`metadataValue${metadataValue}`);
  await submitTxAndWaitConfirmation(
    CrydrControllerLicensedBaseInterface
      .at(crydrViewAddress)
      .setMetadata
      .sendTransaction,
    [metadataKey, metadataValue, { from: managerAddress }]);
  global.console.log('\tCrydr view metadata successfully set');
};

export const getMetadata = async (crydrViewAddress, metadataKey) =>
  CrydrControllerLicensedBaseInterface.at(crydrViewAddress).getMetadata.call(metadataKey);

export const getMetadataHash = async (crydrViewAddress, metadataKey) =>
  CrydrControllerLicensedBaseInterface.at(crydrViewAddress).getMetadataHash.call(metadataKey);


/**
 * Permissions
 */

export const grantManagerPermissions = async (crydrControllerAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for crydr view that is able to store metadata ...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'set_metadata',
  ];

  await ManageableJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                ownerAddress,
                                                managerAddress,
                                                managerPermissions);

  global.console.log('\tPermissions to the manager of crydr view that is able to store metadata granted');
  return null;
};
