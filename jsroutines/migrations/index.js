/* Migration scripts */

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

import * as DeployConfig from '../jsconfig/DeployConfig';
import * as CrydrInit from '../jsinit/CrydrInit';
import * as JcashRegistrarInit from '../jsinit/JcashRegistrarInit';
import * as PausableInterfaceJSAPI from '../../contracts/lifecycle/Pausable/PausableInterface.jsapi';


/* Migration #2 */

export const executeMigrationNumber2 = async () => {
  await CrydrInit.initCrydr(JNTStorageArtifact, JNTControllerArtifact, JNTViewERC20Artifact, 'erc20');
  await CrydrInit.upauseCrydrContract(JNTStorageArtifact, 'storage');
  await CrydrInit.upauseCrydrContract(JNTControllerArtifact, 'controller');
};

export const verifyMigrationNumber2 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #3 */

const executeMigrationNumber3 = async () => {
  await CrydrInit.upauseCrydrContract(JNTViewERC20Artifact, 'view');
};

const verifyMigrationNumber3 = async () => {
  // todo verify migration, make integration tests
};

/* Migration #4 */

const executeMigrationNumber4 = async () => {
  /* JUSD */

  await CrydrInit.initLicensedCrydr(JUSDStorageArtifact, JUSDLicenseRegistryArtifact, JUSDControllerArtifact, JUSDViewERC20Artifact, 'erc20');

  await CrydrInit.upauseCrydrContract(JUSDStorageArtifact, 'storage');
  await CrydrInit.upauseCrydrContract(JUSDLicenseRegistryArtifact, 'license_registry');
  await CrydrInit.upauseCrydrContract(JUSDControllerArtifact, 'controller');
  await CrydrInit.upauseCrydrContract(JUSDViewERC20Artifact, 'view');

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


  /* JEUR */

  await CrydrInit.initLicensedCrydr(JEURStorageArtifact, JEURLicenseRegistryArtifact, JEURControllerArtifact, JEURViewERC20Artifact, 'erc20');

  await CrydrInit.upauseCrydrContract(JEURStorageArtifact, 'storage');
  await CrydrInit.upauseCrydrContract(JEURLicenseRegistryArtifact, 'license_registry');
  await CrydrInit.upauseCrydrContract(JEURControllerArtifact, 'controller');
  await CrydrInit.upauseCrydrContract(JEURViewERC20Artifact, 'view');

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


  /* JGBP */

  await CrydrInit.initLicensedCrydr(JGBPStorageArtifact, JGBPLicenseRegistryArtifact, JGBPControllerArtifact, JGBPViewERC20Artifact, 'erc20');

  await CrydrInit.upauseCrydrContract(JGBPStorageArtifact, 'storage');
  await CrydrInit.upauseCrydrContract(JGBPLicenseRegistryArtifact, 'license_registry');
  await CrydrInit.upauseCrydrContract(JGBPControllerArtifact, 'controller');
  await CrydrInit.upauseCrydrContract(JGBPViewERC20Artifact, 'view');

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


  /* JKRW */

  await CrydrInit.initLicensedCrydr(JKRWStorageArtifact, JKRWLicenseRegistryArtifact, JKRWControllerArtifact, JKRWViewERC20Artifact, 'erc20');

  await CrydrInit.upauseCrydrContract(JKRWStorageArtifact, 'storage');
  await CrydrInit.upauseCrydrContract(JKRWLicenseRegistryArtifact, 'license_registry');
  await CrydrInit.upauseCrydrContract(JKRWControllerArtifact, 'controller');
  await CrydrInit.upauseCrydrContract(JKRWViewERC20Artifact, 'view');

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


  /* JJOD */

  await CrydrInit.initLicensedCrydr(JJODStorageArtifact, JJODLicenseRegistryArtifact, JJODControllerArtifact, JJODViewERC20Artifact, 'erc20');

  await CrydrInit.upauseCrydrContract(JJODStorageArtifact, 'storage');
  await CrydrInit.upauseCrydrContract(JJODLicenseRegistryArtifact, 'license_registry');
  await CrydrInit.upauseCrydrContract(JJODControllerArtifact, 'controller');
  await CrydrInit.upauseCrydrContract(JJODViewERC20Artifact, 'view');

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

const verifyMigrationNumber4 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #5 */

const executeMigrationNumber5 = async () => {
  const {
    owner,
    managerPause,
    managerJcashReplenisher,
    managerJcashExchange,
    managerJNT,
    jntBeneficiary,
  } = DeployConfig.getAccounts();

  const jntControllerInstance = await JNTControllerArtifact.deployed();
  const jntControllerAddress = jntControllerInstance.address;


  await JcashRegistrarInit.deployJcashRegistrar(JcashRegistrarArtifact, owner);
  const JcashRegistrarInstance = await JcashRegistrarArtifact.deployed();
  const JcashRegistrarAddress = JcashRegistrarInstance.address;

  await JcashRegistrarInit.configureManagers(JcashRegistrarAddress, owner,
                                             managerPause, managerJcashReplenisher, managerJcashExchange);
  await JcashRegistrarInit.configureJNTConnection(JcashRegistrarAddress, owner,
                                                  jntControllerAddress, managerJNT, jntBeneficiary, 10 ** 18);
  await PausableInterfaceJSAPI.unpauseContract(JcashRegistrarAddress, managerPause);
};

const verifyMigrationNumber5 = async () => {
  const {
    owner,
    managerPause,
    managerJcashReplenisher,
    managerJcashExchange,
    managerJNT,
    jntBeneficiary,
  } = DeployConfig.getAccounts();

  const jntControllerInstance = await JNTControllerArtifact.deployed();
  const jntControllerAddress = jntControllerInstance.address;

  const jcashRegistrarInstance = await JcashRegistrarArtifact.deployed();
  const jcashRegistrarAddress = jcashRegistrarInstance.address;

  const isVerified1 = await JcashRegistrarInit.verifyManagers(jcashRegistrarAddress, owner,
                                                              managerPause, managerJcashReplenisher, managerJcashExchange);
  const isVerified2 = await JcashRegistrarInit.verifyJNTConnection(jcashRegistrarAddress,
                                                                   jntControllerAddress, managerJNT, jntBeneficiary, 10 ** 18);
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
  } else {
    throw new Error(`Unknown migration to execute: ${migrationNumber}`);
  }
};
