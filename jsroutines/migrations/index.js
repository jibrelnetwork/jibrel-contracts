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

export const executeMigrationNumber2 = async () => {
  await CrydrInit.initCrydr(JNTStorageArtifact, JNTControllerArtifact, JNTViewERC20Artifact, 'erc20', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JNTStorageArtifact, 'storage', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JNTControllerArtifact, 'controller', DeployConfig.getEthAccounts());
};

export const verifyMigrationNumber2 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #3 */

const executeMigrationNumber3 = async () => {
  await CrydrInit.upauseCrydrContract(JNTViewERC20Artifact, 'view', DeployConfig.getEthAccounts());
};

const verifyMigrationNumber3 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #4 */

const executeMigrationNumber4 = async () => {
  /* JUSD */

  await CrydrInit.initLicensedCrydr(JUSDStorageArtifact, JUSDLicenseRegistryArtifact, JUSDControllerArtifact, JUSDViewERC20Artifact, 'erc20', DeployConfig.getEthAccounts());

  await CrydrInit.upauseCrydrContract(JUSDStorageArtifact, 'storage', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JUSDLicenseRegistryArtifact, 'license_registry', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JUSDControllerArtifact, 'controller', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JUSDViewERC20Artifact, 'view', DeployConfig.getEthAccounts());

  const JUSDStorageInstance = await JUSDStorageArtifact.deployed();
  const JUSDStorageAddress = JUSDStorageInstance.address;
  const JUSDLicenseRegistryInstance = await JUSDLicenseRegistryArtifact.deployed();
  const JUSDLicenseRegistryAddress = JUSDLicenseRegistryInstance.address;
  const JUSDControllerInstance = await JUSDControllerArtifact.deployed();
  const JUSDControllerAddress = JUSDControllerInstance.address;
  const JUSDViewERC20Instance = await JUSDViewERC20Artifact.deployed();
  const JUSDViewERC20Address = JUSDViewERC20Instance.address;

  global.console.log('  JUSD deployed, configured and unpaused:');
  global.console.log(`\tJUSDStorageAddress: ${JUSDStorageAddress}`);
  global.console.log(`\tJUSDLicenseRegistryAddress: ${JUSDLicenseRegistryAddress}`);
  global.console.log(`\tJUSDControllerAddress: ${JUSDControllerAddress}`);
  global.console.log(`\tJUSDViewERC20Address: ${JUSDViewERC20Address}`);
};

const verifyMigrationNumber4 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #5 */

const executeMigrationNumber5 = async () => {
  /* JEUR */

  await CrydrInit.initLicensedCrydr(JEURStorageArtifact, JEURLicenseRegistryArtifact, JEURControllerArtifact, JEURViewERC20Artifact, 'erc20', DeployConfig.getEthAccounts());

  await CrydrInit.upauseCrydrContract(JEURStorageArtifact, 'storage', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JEURLicenseRegistryArtifact, 'license_registry', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JEURControllerArtifact, 'controller', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JEURViewERC20Artifact, 'view', DeployConfig.getEthAccounts());

  const JEURStorageInstance = await JEURStorageArtifact.deployed();
  const JEURStorageAddress = JEURStorageInstance.address;
  const JEURLicenseRegistryInstance = await JEURLicenseRegistryArtifact.deployed();
  const JEURLicenseRegistryAddress = JEURLicenseRegistryInstance.address;
  const JEURControllerInstance = await JEURControllerArtifact.deployed();
  const JEURControllerAddress = JEURControllerInstance.address;
  const JEURViewERC20Instance = await JEURViewERC20Artifact.deployed();
  const JEURViewERC20Address = JEURViewERC20Instance.address;

  global.console.log('  JEUR deployed, configured and unpaused:');
  global.console.log(`\tJEURStorageAddress: ${JEURStorageAddress}`);
  global.console.log(`\tJEURLicenseRegistryAddress: ${JEURLicenseRegistryAddress}`);
  global.console.log(`\tJEURControllerAddress: ${JEURControllerAddress}`);
  global.console.log(`\tJEURViewERC20Address: ${JEURViewERC20Address}`);
};

const verifyMigrationNumber5 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #6 */

const executeMigrationNumber6 = async () => {
  /* JGBP */

  await CrydrInit.initLicensedCrydr(JGBPStorageArtifact, JGBPLicenseRegistryArtifact, JGBPControllerArtifact, JGBPViewERC20Artifact, 'erc20', DeployConfig.getEthAccounts());

  await CrydrInit.upauseCrydrContract(JGBPStorageArtifact, 'storage', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JGBPLicenseRegistryArtifact, 'license_registry', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JGBPControllerArtifact, 'controller', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JGBPViewERC20Artifact, 'view', DeployConfig.getEthAccounts());

  const JGBPStorageInstance = await JGBPStorageArtifact.deployed();
  const JGBPStorageAddress = JGBPStorageInstance.address;
  const JGBPLicenseRegistryInstance = await JGBPLicenseRegistryArtifact.deployed();
  const JGBPLicenseRegistryAddress = JGBPLicenseRegistryInstance.address;
  const JGBPControllerInstance = await JGBPControllerArtifact.deployed();
  const JGBPControllerAddress = JGBPControllerInstance.address;
  const JGBPViewERC20Instance = await JGBPViewERC20Artifact.deployed();
  const JGBPViewERC20Address = JGBPViewERC20Instance.address;

  global.console.log('  JGBP deployed, configured and unpaused:');
  global.console.log(`\tJGBPStorageAddress: ${JGBPStorageAddress}`);
  global.console.log(`\tJGBPLicenseRegistryAddress: ${JGBPLicenseRegistryAddress}`);
  global.console.log(`\tJGBPControllerAddress: ${JGBPControllerAddress}`);
  global.console.log(`\tJGBPViewERC20Address: ${JGBPViewERC20Address}`);
};

const verifyMigrationNumber6 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #7 */

const executeMigrationNumber7 = async () => {
  /* JKRW */

  await CrydrInit.initLicensedCrydr(JKRWStorageArtifact, JKRWLicenseRegistryArtifact, JKRWControllerArtifact, JKRWViewERC20Artifact, 'erc20', DeployConfig.getEthAccounts());

  await CrydrInit.upauseCrydrContract(JKRWStorageArtifact, 'storage', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JKRWLicenseRegistryArtifact, 'license_registry', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JKRWControllerArtifact, 'controller', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JKRWViewERC20Artifact, 'view', DeployConfig.getEthAccounts());

  const JKRWStorageInstance = await JKRWStorageArtifact.deployed();
  const JKRWStorageAddress = JKRWStorageInstance.address;
  const JKRWLicenseRegistryInstance = await JKRWLicenseRegistryArtifact.deployed();
  const JKRWLicenseRegistryAddress = JKRWLicenseRegistryInstance.address;
  const JKRWControllerInstance = await JKRWControllerArtifact.deployed();
  const JKRWControllerAddress = JKRWControllerInstance.address;
  const JKRWViewERC20Instance = await JKRWViewERC20Artifact.deployed();
  const JKRWViewERC20Address = JKRWViewERC20Instance.address;

  global.console.log('  JKRW deployed, configured and unpaused:');
  global.console.log(`\tJKRWStorageAddress: ${JKRWStorageAddress}`);
  global.console.log(`\tJKRWLicenseRegistryAddress: ${JKRWLicenseRegistryAddress}`);
  global.console.log(`\tJKRWControllerAddress: ${JKRWControllerAddress}`);
  global.console.log(`\tJKRWViewERC20Address: ${JKRWViewERC20Address}`);
};

const verifyMigrationNumber7 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #8 */

const executeMigrationNumber8 = async () => {
  /* JJOD */

  await CrydrInit.initLicensedCrydr(JJODStorageArtifact, JJODLicenseRegistryArtifact, JJODControllerArtifact, JJODViewERC20Artifact, 'erc20', DeployConfig.getEthAccounts());

  await CrydrInit.upauseCrydrContract(JJODStorageArtifact, 'storage', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JJODLicenseRegistryArtifact, 'license_registry', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JJODControllerArtifact, 'controller', DeployConfig.getEthAccounts());
  await CrydrInit.upauseCrydrContract(JJODViewERC20Artifact, 'view', DeployConfig.getEthAccounts());

  const JJODStorageInstance = await JJODStorageArtifact.deployed();
  const JJODStorageAddress = JJODStorageInstance.address;
  const JJODLicenseRegistryInstance = await JJODLicenseRegistryArtifact.deployed();
  const JJODLicenseRegistryAddress = JJODLicenseRegistryInstance.address;
  const JJODControllerInstance = await JJODControllerArtifact.deployed();
  const JJODControllerAddress = JJODControllerInstance.address;
  const JJODViewERC20Instance = await JJODViewERC20Artifact.deployed();
  const JJODViewERC20Address = JJODViewERC20Instance.address;

  global.console.log('  JJOD deployed, configured and unpaused:');
  global.console.log(`\tJJODStorageAddress: ${JJODStorageAddress}`);
  global.console.log(`\tJJODLicenseRegistryAddress: ${JJODLicenseRegistryAddress}`);
  global.console.log(`\tJJODControllerAddress: ${JJODControllerAddress}`);
  global.console.log(`\tJJODViewERC20Address: ${JJODViewERC20Address}`);
};

const verifyMigrationNumber8 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #9 */

const executeMigrationNumber9 = async () => {
  const jntControllerInstance = await JNTControllerArtifact.deployed();
  const jntControllerAddress = jntControllerInstance.address;

  await JcashRegistrarInit.deployJcashRegistrar(JcashRegistrarArtifact, DeployConfig.getEthAccounts());
  const JcashRegistrarInstance = await JcashRegistrarArtifact.deployed();
  const JcashRegistrarAddress = JcashRegistrarInstance.address;

  await JcashRegistrarInit.configureManagers(JcashRegistrarAddress, DeployConfig.getEthAccounts());
  await JcashRegistrarInit.configureJNTConnection(JcashRegistrarAddress, jntControllerAddress, DeployConfig.getEthAccounts(), 10 ** 18);
  await PausableInterfaceJSAPI.unpauseContract(JcashRegistrarAddress, DeployConfig.getEthAccounts().managerPause);
};

const verifyMigrationNumber9 = async () => {
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
  } else if (migrationNumber === 9) {
    await executeMigrationNumber9();
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
  } else if (migrationNumber === 9) {
    await verifyMigrationNumber9();
  } else {
    throw new Error(`Unknown migration to execute: ${migrationNumber}`);
  }
};
