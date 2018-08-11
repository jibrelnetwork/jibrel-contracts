/* Migration scripts */

import * as DeployConfig from '../jsconfig/DeployConfig';
import * as CrydrInit from '../jsinit/CrydrInit';
import * as JcashRegistrarInit from '../jsinit/JcashRegistrarInit';
import * as PausableInterfaceJSAPI from '../../contracts/lifecycle/Pausable/PausableInterface.jsapi';

const JNTStorageArtifact    = global.artifacts.require('JNTStorage.sol');
const JNTControllerArtifact = global.artifacts.require('JNTController.sol');
const JNTViewERC20Artifact  = global.artifacts.require('JNTViewERC20.sol');

const JUSDStorageArtifact         = global.artifacts.require('JUSDStorage.sol');
const JUSDLicenseRegistryArtifact = global.artifacts.require('JUSDLicenseRegistry.sol');
const JUSDControllerArtifact      = global.artifacts.require('JUSDController.sol');
const JUSDViewERC20Artifact       = global.artifacts.require('JUSDViewERC20.sol');

const JEURStorageArtifact         = global.artifacts.require('JEURStorage.sol');
const JEURLicenseRegistryArtifact = global.artifacts.require('JEURLicenseRegistry.sol');
const JEURControllerArtifact      = global.artifacts.require('JEURController.sol');
const JEURViewERC20Artifact       = global.artifacts.require('JEURViewERC20.sol');

const JGBPStorageArtifact         = global.artifacts.require('JGBPStorage.sol');
const JGBPLicenseRegistryArtifact = global.artifacts.require('JGBPLicenseRegistry.sol');
const JGBPControllerArtifact      = global.artifacts.require('JGBPController.sol');
const JGBPViewERC20Artifact       = global.artifacts.require('JGBPViewERC20.sol');

const JKRWStorageArtifact         = global.artifacts.require('JKRWStorage.sol');
const JKRWLicenseRegistryArtifact = global.artifacts.require('JKRWLicenseRegistry.sol');
const JKRWControllerArtifact      = global.artifacts.require('JKRWController.sol');
const JKRWViewERC20Artifact       = global.artifacts.require('JKRWViewERC20.sol');

const JJODStorageArtifact         = global.artifacts.require('JJODStorage.sol');
const JJODLicenseRegistryArtifact = global.artifacts.require('JJODLicenseRegistry.sol');
const JJODControllerArtifact      = global.artifacts.require('JJODController.sol');
const JJODViewERC20Artifact       = global.artifacts.require('JJODViewERC20.sol');

const JcashRegistrarArtifact = global.artifacts.require('JcashRegistrar.sol');


/* Migration #2 */

const executeMigrationNumber2 = async () => {
  const contractAddresses = await CrydrInit.initCrydr(JNTStorageArtifact,
                                                      JNTControllerArtifact,
                                                      JNTViewERC20Artifact,
                                                      'erc20',
                                                      DeployConfig.getEthAccounts());

  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[0], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[1], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[2], DeployConfig.getEthAccounts().managerPause);
};

const verifyMigrationNumber2 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #3 */

const executeMigrationNumber3 = async () => {
  /* JUSD */

  const contractAddresses = await CrydrInit.initLicensedCrydr(JUSDStorageArtifact,
                                                              JUSDLicenseRegistryArtifact,
                                                              JUSDControllerArtifact,
                                                              JUSDViewERC20Artifact,
                                                              'erc20',
                                                              DeployConfig.getEthAccounts());

  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[0], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[1], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[2], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[3], DeployConfig.getEthAccounts().managerPause);

  global.console.log('  JUSD deployed, configured and unpaused:');
  global.console.log(`\tJUSDStorageAddress: ${contractAddresses[0]}`);
  global.console.log(`\tJUSDLicenseRegistryAddress: ${contractAddresses[3]}`);
  global.console.log(`\tJUSDControllerAddress: ${contractAddresses[1]}`);
  global.console.log(`\tJUSDViewERC20Address: ${contractAddresses[2]}`);
};

const verifyMigrationNumber3 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #4 */

const executeMigrationNumber4 = async () => {
  /* JEUR */

  const contractAddresses = await CrydrInit.initLicensedCrydr(JEURStorageArtifact,
                                                              JEURLicenseRegistryArtifact,
                                                              JEURControllerArtifact,
                                                              JEURViewERC20Artifact,
                                                              'erc20',
                                                              DeployConfig.getEthAccounts());

  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[0], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[1], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[2], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[3], DeployConfig.getEthAccounts().managerPause);

  global.console.log('  JEUR deployed, configured and unpaused:');
  global.console.log(`\tJEURStorageAddress: ${contractAddresses[0]}`);
  global.console.log(`\tJEURLicenseRegistryAddress: ${contractAddresses[3]}`);
  global.console.log(`\tJEURControllerAddress: ${contractAddresses[1]}`);
  global.console.log(`\tJEURViewERC20Address: ${contractAddresses[2]}`);
};

const verifyMigrationNumber4 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #5 */

const executeMigrationNumber5 = async () => {
  /* JGBP */

  const contractAddresses = await CrydrInit.initLicensedCrydr(JGBPStorageArtifact,
                                                              JGBPLicenseRegistryArtifact,
                                                              JGBPControllerArtifact,
                                                              JGBPViewERC20Artifact,
                                                              'erc20',
                                                              DeployConfig.getEthAccounts());

  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[0], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[1], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[2], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[3], DeployConfig.getEthAccounts().managerPause);

  global.console.log('  JGBP deployed, configured and unpaused:');
  global.console.log(`\tJGBPStorageAddress: ${contractAddresses[0]}`);
  global.console.log(`\tJGBPLicenseRegistryAddress: ${contractAddresses[3]}`);
  global.console.log(`\tJGBPControllerAddress: ${contractAddresses[1]}`);
  global.console.log(`\tJGBPViewERC20Address: ${contractAddresses[2]}`);
};

const verifyMigrationNumber5 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #6 */

const executeMigrationNumber6 = async () => {
  /* JKRW */

  const contractAddresses = await CrydrInit.initLicensedCrydr(JKRWStorageArtifact,
                                                              JKRWLicenseRegistryArtifact,
                                                              JKRWControllerArtifact,
                                                              JKRWViewERC20Artifact,
                                                              'erc20',
                                                              DeployConfig.getEthAccounts());

  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[0], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[1], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[2], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[3], DeployConfig.getEthAccounts().managerPause);

  global.console.log('  JKRW deployed, configured and unpaused:');
  global.console.log(`\tJKRWStorageAddress: ${contractAddresses[0]}`);
  global.console.log(`\tJKRWLicenseRegistryAddress: ${contractAddresses[3]}`);
  global.console.log(`\tJKRWControllerAddress: ${contractAddresses[1]}`);
  global.console.log(`\tJKRWViewERC20Address: ${contractAddresses[2]}`);
};

const verifyMigrationNumber6 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #7 */

const executeMigrationNumber7 = async () => {
  /* JJOD */

  const contractAddresses = await CrydrInit.initLicensedCrydr(JJODStorageArtifact,
                                                              JJODLicenseRegistryArtifact,
                                                              JJODControllerArtifact,
                                                              JJODViewERC20Artifact,
                                                              'erc20',
                                                              DeployConfig.getEthAccounts());

  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[0], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[1], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[2], DeployConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[3], DeployConfig.getEthAccounts().managerPause);

  global.console.log('  JJOD deployed, configured and unpaused:');
  global.console.log(`\tJJODStorageAddress: ${contractAddresses[0]}`);
  global.console.log(`\tJJODLicenseRegistryAddress: ${contractAddresses[3]}`);
  global.console.log(`\tJJODControllerAddress: ${contractAddresses[1]}`);
  global.console.log(`\tJJODViewERC20Address: ${contractAddresses[2]}`);
};

const verifyMigrationNumber7 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #8 */

const executeMigrationNumber8 = async () => {
  const jntControllerInstance = await JNTControllerArtifact.deployed();
  const jntControllerAddress = jntControllerInstance.address;

  const JcashRegistrarAddress = await JcashRegistrarInit.deployJcashRegistrar(JcashRegistrarArtifact, DeployConfig.getEthAccounts());

  await JcashRegistrarInit.configureManagers(JcashRegistrarAddress, DeployConfig.getEthAccounts());
  await JcashRegistrarInit.configureJNTConnection(JcashRegistrarAddress, jntControllerAddress, DeployConfig.getEthAccounts(), 10 ** 18);
  await PausableInterfaceJSAPI.unpauseContract(JcashRegistrarAddress, DeployConfig.getEthAccounts().managerPause);
};

const verifyMigrationNumber8 = async () => {
  const jntControllerInstance = await JNTControllerArtifact.deployed();
  const jntControllerAddress = jntControllerInstance.address;

  const jcashRegistrarInstance = await JcashRegistrarArtifact.deployed();
  const jcashRegistrarAddress = jcashRegistrarInstance.address;

  const isVerified1 = await JcashRegistrarInit.verifyManagers(jcashRegistrarAddress, DeployConfig.getEthAccounts());
  const isVerified2 = await JcashRegistrarInit.verifyJNTConnection(jcashRegistrarAddress,
                                                                   jntControllerAddress, DeployConfig.getEthAccounts(), 10 ** 18);
  if (isVerified1 !== true || isVerified2 !== true) {
    throw new Error('Failed to verify deployed JcashRegistrar');
  }
};


/* Migrations */

export const executeMigration = async (migrationNumber) => {
  if (migrationNumber === 2) {
    await executeMigrationNumber2();
  } else if (migrationNumber === 3) {
    await executeMigrationNumber3();
  } else if (migrationNumber === 4) {
    await executeMigrationNumber4();
  } else if (migrationNumber === 5) {
    await executeMigrationNumber5();
  } else if (migrationNumber === 6) {
    await executeMigrationNumber6();
  } else if (migrationNumber === 7) {
    await executeMigrationNumber7();
  } else if (migrationNumber === 8) {
    await executeMigrationNumber8();
  } else {
    throw new Error(`Unknown migration to execute: ${migrationNumber}`);
  }
};

export const verifyMigration = async (migrationNumber) => {
  if (migrationNumber === 2) {
    await verifyMigrationNumber2();
  } else if (migrationNumber === 3) {
    await verifyMigrationNumber3();
  } else if (migrationNumber === 4) {
    await verifyMigrationNumber4();
  } else if (migrationNumber === 5) {
    await verifyMigrationNumber5();
  } else if (migrationNumber === 6) {
    await verifyMigrationNumber6();
  } else if (migrationNumber === 7) {
    await verifyMigrationNumber7();
  } else if (migrationNumber === 8) {
    await verifyMigrationNumber8();
  } else {
    throw new Error(`Unknown migration to execute: ${migrationNumber}`);
  }
};
