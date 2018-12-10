/* Migration scripts */

import * as PausableInterfaceJSAPI from '../../contracts/lifecycle/Pausable/PausableInterface.jsapi';

import * as TxConfig from '../jsconfig/TxConfig';

import * as CrydrInit from '../jsinit/CrydrInit';

const JAHBStorageArtifact         = global.artifacts.require('JAHBStorage.sol');
const JAHBLicenseRegistryArtifact = global.artifacts.require('JAHBLicenseRegistry.sol');
const JAHBControllerArtifact      = global.artifacts.require('JAHBController.sol');
const JAHBViewERC20Artifact       = global.artifacts.require('JAHBViewERC20.sol');


/* Migration #2 */

const executeMigrationNumber2 = async () => {
  /* JAHB */

  const contractAddresses = await CrydrInit.initLicensedCrydr(JAHBStorageArtifact,
                                                              JAHBLicenseRegistryArtifact,
                                                              JAHBControllerArtifact,
                                                              JAHBViewERC20Artifact,
                                                              'erc20',
                                                              TxConfig.getEthAccounts());

  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[0], TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[1], TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[2], TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[3], TxConfig.getEthAccounts().managerPause);

  global.console.log('  JAHB deployed, configured and unpaused:');
  global.console.log(`\tJAHBStorageAddress: ${contractAddresses[0]}`);
  global.console.log(`\tJAHBLicenseRegistryAddress: ${contractAddresses[1]}`);
  global.console.log(`\tJAHBControllerAddress: ${contractAddresses[2]}`);
  global.console.log(`\tJAHBViewERC20Address: ${contractAddresses[3]}`);

  return contractAddresses;
};

const verifyMigrationNumber2 = async () => {
  // todo verify migration, make integration tests
};


/* Migrations */

export const executeMigration = async (migrationNumber, migrationParams = []) => {
  let result;
  if (migrationNumber === 2) {
    result = await executeMigrationNumber2(...migrationParams);
  } else {
    throw new Error(`Unknown migration to execute: ${migrationNumber}`);
  }
  return result;
};

export const verifyMigration = async (migrationNumber) => {
  if (migrationNumber === 2) {
    await verifyMigrationNumber2();
  } else {
    throw new Error(`Unknown migration to execute: ${migrationNumber}`);
  }
};
