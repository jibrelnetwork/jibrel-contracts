/* Migration scripts */

import * as PausableInterfaceJSAPI from '../../contracts/lifecycle/Pausable/PausableInterface.jsapi';

import * as TxConfig from '../jsconfig/TxConfig';

import * as CrydrInit from '../jsinit/CrydrInit';
import * as JcashRegistrarInit from '../jsinit/JcashRegistrarInit';

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
  // const contractAddresses = await CrydrInit.initCrydr(JNTStorageArtifact,
  //                                                     JNTControllerArtifact,
  //                                                     JNTViewERC20Artifact,
  //                                                     'erc20',
  //                                                     TxConfig.getEthAccounts());
  //
  // await PausableInterfaceJSAPI.unpauseContract(contractAddresses[0], TxConfig.getEthAccounts().managerPause);
  // await PausableInterfaceJSAPI.unpauseContract(contractAddresses[1], TxConfig.getEthAccounts().managerPause);
  // await PausableInterfaceJSAPI.unpauseContract(contractAddresses[2], TxConfig.getEthAccounts().managerPause);
  //
  // global.console.log('  JNT deployed, configured and unpaused:');
  // global.console.log(`\tJNTStorageAddress: ${contractAddresses[0]}`);
  // global.console.log(`\tJNTControllerAddress: ${contractAddresses[1]}`);
  // global.console.log(`\tJNTViewERC20Address: ${contractAddresses[2]}`);
  //
  // return contractAddresses;
  return [];
};

const verifyMigrationNumber2 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #3 */

const executeMigrationNumber3 = async () => {
  /* JUSD */

  const storage = '0x0c53a3be5e0413f8fa47b8663dd20176b7201f84';
  const licenseRegistry = '0xeAf9A68cc9012c095C07cAA81C5F931272d9f1D6';
  const view = '0x3c7626e41f85150c138a684c7de14bbd636b4596';

  await PausableInterfaceJSAPI.pauseContract(storage, TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.pauseContract(view, TxConfig.getEthAccounts().managerPause);

  const contractAddresses = await CrydrInit.initLicensedCrydr(JUSDStorageArtifact,
                                                              JUSDLicenseRegistryArtifact,
                                                              JUSDControllerArtifact,
                                                              JUSDViewERC20Artifact,
                                                              'erc20',
                                                              TxConfig.getEthAccounts(),
                                                              storage, licenseRegistry, view);

  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[0], TxConfig.getEthAccounts().managerPause);
  // await PausableInterfaceJSAPI.unpauseContract(contractAddresses[1], TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[2], TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[3], TxConfig.getEthAccounts().managerPause);

  global.console.log('  JUSD deployed, configured and unpaused:');
  global.console.log(`\tJUSDStorageAddress: ${contractAddresses[0]}`);
  global.console.log(`\tJUSDLicenseRegistryAddress: ${contractAddresses[1]}`);
  global.console.log(`\tJUSDControllerAddress: ${contractAddresses[2]}`);
  global.console.log(`\tJUSDViewERC20Address: ${contractAddresses[3]}`);

  return contractAddresses;
};

const verifyMigrationNumber3 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #4 */

const executeMigrationNumber4 = async () => {
  /* JEUR */

  const storage = '0x32918da5302105de1c329e4f50298fce6833429d';
  const licenseRegistry = '0x58644d3c6b10b09989749033b3fe80521669f40d';
  const view = '0x814bac0cdaf98ad7442a5725a52ebac638267e96';

  await PausableInterfaceJSAPI.pauseContract(storage, TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.pauseContract(view, TxConfig.getEthAccounts().managerPause);

  const contractAddresses = await CrydrInit.initLicensedCrydr(JEURStorageArtifact,
                                                              JEURLicenseRegistryArtifact,
                                                              JEURControllerArtifact,
                                                              JEURViewERC20Artifact,
                                                              'erc20',
                                                              TxConfig.getEthAccounts(),
                                                              storage, licenseRegistry, view);

  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[0], TxConfig.getEthAccounts().managerPause);
  // await PausableInterfaceJSAPI.unpauseContract(contractAddresses[1], TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[2], TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[3], TxConfig.getEthAccounts().managerPause);

  global.console.log('  JEUR deployed, configured and unpaused:');
  global.console.log(`\tJEURStorageAddress: ${contractAddresses[0]}`);
  global.console.log(`\tJEURLicenseRegistryAddress: ${contractAddresses[1]}`);
  global.console.log(`\tJEURControllerAddress: ${contractAddresses[2]}`);
  global.console.log(`\tJEURViewERC20Address: ${contractAddresses[3]}`);

  return contractAddresses;
};

const verifyMigrationNumber4 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #5 */

const executeMigrationNumber5 = async () => {
  /* JGBP */

  const storage = '0x3525f554cdbdba75973aa341cbfcb1d5e3d13812';
  const licenseRegistry = '0xf33b5d9cefff246f24f5a17dc3a34fb2f1f87612';
  const view = '0xada5dcb3ca6406b24ce170c95e3d10545adae202';

  await PausableInterfaceJSAPI.pauseContract(storage, TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.pauseContract(view, TxConfig.getEthAccounts().managerPause);

  const contractAddresses = await CrydrInit.initLicensedCrydr(JGBPStorageArtifact,
                                                              JGBPLicenseRegistryArtifact,
                                                              JGBPControllerArtifact,
                                                              JGBPViewERC20Artifact,
                                                              'erc20',
                                                              TxConfig.getEthAccounts(),
                                                              storage, licenseRegistry, view);

  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[0], TxConfig.getEthAccounts().managerPause);
  // await PausableInterfaceJSAPI.unpauseContract(contractAddresses[1], TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[2], TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[3], TxConfig.getEthAccounts().managerPause);

  global.console.log('  JGBP deployed, configured and unpaused:');
  global.console.log(`\tJGBPStorageAddress: ${contractAddresses[0]}`);
  global.console.log(`\tJGBPLicenseRegistryAddress: ${contractAddresses[1]}`);
  global.console.log(`\tJGBPControllerAddress: ${contractAddresses[2]}`);
  global.console.log(`\tJGBPViewERC20Address: ${contractAddresses[3]}`);

  return contractAddresses;
};

const verifyMigrationNumber5 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #6 */

const executeMigrationNumber6 = async () => {
  /* JKRW */

  const storage = '0xdfb4847ff4d7580ede4ddb2b946686b4eb9eab14';
  const licenseRegistry = '0xf9bb522147013475a4842043aa214bb577a77839';
  const view = '0x3aee4eea2cbb7769a1dcbc4f7287c85c45e2a70f';

  await PausableInterfaceJSAPI.pauseContract(storage, TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.pauseContract(view, TxConfig.getEthAccounts().managerPause);

  const contractAddresses = await CrydrInit.initLicensedCrydr(JKRWStorageArtifact,
                                                              JKRWLicenseRegistryArtifact,
                                                              JKRWControllerArtifact,
                                                              JKRWViewERC20Artifact,
                                                              'erc20',
                                                              TxConfig.getEthAccounts(),
                                                              storage, licenseRegistry, view);

  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[0], TxConfig.getEthAccounts().managerPause);
  // await PausableInterfaceJSAPI.unpauseContract(contractAddresses[1], TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[2], TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[3], TxConfig.getEthAccounts().managerPause);

  global.console.log('  JKRW deployed, configured and unpaused:');
  global.console.log(`\tJKRWStorageAddress: ${contractAddresses[0]}`);
  global.console.log(`\tJKRWLicenseRegistryAddress: ${contractAddresses[1]}`);
  global.console.log(`\tJKRWControllerAddress: ${contractAddresses[2]}`);
  global.console.log(`\tJKRWViewERC20Address: ${contractAddresses[3]}`);

  return contractAddresses;
};

const verifyMigrationNumber6 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #7 */

const executeMigrationNumber7 = async () => {
  /* JJOD */

  const storage = '0xe127da95fe506913c39d8a23e8d2e858c1f15d98';
  const licenseRegistry = '0xe2831143a275c7e05ada4af87a85c38531cdffc7';
  const view = '0xa125fef3f84df7996babc5f67d1929f5329af6ce';

  await PausableInterfaceJSAPI.pauseContract(storage, TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.pauseContract(view, TxConfig.getEthAccounts().managerPause);

  const contractAddresses = await CrydrInit.initLicensedCrydr(JJODStorageArtifact,
                                                              JJODLicenseRegistryArtifact,
                                                              JJODControllerArtifact,
                                                              JJODViewERC20Artifact,
                                                              'erc20',
                                                              TxConfig.getEthAccounts(),
                                                              storage, licenseRegistry, view);

  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[0], TxConfig.getEthAccounts().managerPause);
  // await PausableInterfaceJSAPI.unpauseContract(contractAddresses[1], TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[2], TxConfig.getEthAccounts().managerPause);
  await PausableInterfaceJSAPI.unpauseContract(contractAddresses[3], TxConfig.getEthAccounts().managerPause);

  global.console.log('  JJOD deployed, configured and unpaused:');
  global.console.log(`\tJJODStorageAddress: ${contractAddresses[0]}`);
  global.console.log(`\tJJODLicenseRegistryAddress: ${contractAddresses[1]}`);
  global.console.log(`\tJJODControllerAddress: ${contractAddresses[2]}`);
  global.console.log(`\tJJODViewERC20Address: ${contractAddresses[3]}`);

  return contractAddresses;
};

const verifyMigrationNumber7 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #8 */

const executeMigrationNumber8 = async (
  jntControllerAddress = undefined,
  jusdLicenseRegistryAddress = undefined,
  jeurLicenseRegistryAddress = undefined,
  jgbpLicenseRegistryAddress = undefined,
  jkrwLicenseRegistryAddress = undefined,
  jjodLicenseRegistryAddress = undefined,
) => {
  let jntControllerAddressToUse = jntControllerAddress;
  if (jntControllerAddressToUse === null || typeof jntControllerAddressToUse === 'undefined') {
    const jntControllerInstance = await JNTControllerArtifact.deployed();
    jntControllerAddressToUse = jntControllerInstance.address;
  }

  let JUSDLicenseRegistryAddressToUse = jusdLicenseRegistryAddress;
  if (JUSDLicenseRegistryAddressToUse === null || typeof JUSDLicenseRegistryAddressToUse === 'undefined') {
    const JUSDLicenseRegistryInstance = await JUSDLicenseRegistryArtifact.deployed();
    JUSDLicenseRegistryAddressToUse = JUSDLicenseRegistryInstance.address;
  }

  let JEURLicenseRegistryAddressToUse = jeurLicenseRegistryAddress;
  if (JEURLicenseRegistryAddressToUse === null || typeof JEURLicenseRegistryAddressToUse === 'undefined') {
    const JEURLicenseRegistryInstance = await JEURLicenseRegistryArtifact.deployed();
    JEURLicenseRegistryAddressToUse = JEURLicenseRegistryInstance.address;
  }

  let JGBPLicenseRegistryAddressToUse = jgbpLicenseRegistryAddress;
  if (JGBPLicenseRegistryAddressToUse === null || typeof JGBPLicenseRegistryAddressToUse === 'undefined') {
    const JGBPLicenseRegistryInstance = await JGBPLicenseRegistryArtifact.deployed();
    JGBPLicenseRegistryAddressToUse = JGBPLicenseRegistryInstance.address;
  }

  let JKRWLicenseRegistryAddressToUse = jkrwLicenseRegistryAddress;
  if (JKRWLicenseRegistryAddressToUse === null || typeof JKRWLicenseRegistryAddressToUse === 'undefined') {
    const JKRWLicenseRegistryInstance = await JKRWLicenseRegistryArtifact.deployed();
    JKRWLicenseRegistryAddressToUse = JKRWLicenseRegistryInstance.address;
  }

  let JJODLicenseRegistryAddressToUse = jjodLicenseRegistryAddress;
  if (JJODLicenseRegistryAddressToUse === null || typeof JJODLicenseRegistryAddressToUse === 'undefined') {
    const JJODLicenseRegistryInstance = await JJODLicenseRegistryArtifact.deployed();
    JJODLicenseRegistryAddressToUse = JJODLicenseRegistryInstance.address;
  }


  const JcashRegistrarAddress = await JcashRegistrarInit.deployJcashRegistrar(JcashRegistrarArtifact, TxConfig.getEthAccounts());

  await JcashRegistrarInit.configureManagers(JcashRegistrarAddress, TxConfig.getEthAccounts());
  await JcashRegistrarInit.configureJNTConnection(JcashRegistrarAddress, jntControllerAddressToUse, TxConfig.getEthAccounts(), 10 ** 18);
  await PausableInterfaceJSAPI.unpauseContract(JcashRegistrarAddress, TxConfig.getEthAccounts().managerPause);

  await JcashRegistrarInit.configureJcashTokenLicenses(JcashRegistrarAddress,
                                                       JUSDLicenseRegistryAddressToUse,
                                                       TxConfig.getEthAccounts());
  await JcashRegistrarInit.configureJcashTokenLicenses(JcashRegistrarAddress,
                                                       JEURLicenseRegistryAddressToUse,
                                                       TxConfig.getEthAccounts());
  await JcashRegistrarInit.configureJcashTokenLicenses(JcashRegistrarAddress,
                                                       JGBPLicenseRegistryAddressToUse,
                                                       TxConfig.getEthAccounts());
  await JcashRegistrarInit.configureJcashTokenLicenses(JcashRegistrarAddress,
                                                       JKRWLicenseRegistryAddressToUse,
                                                       TxConfig.getEthAccounts());
  await JcashRegistrarInit.configureJcashTokenLicenses(JcashRegistrarAddress,
                                                       JJODLicenseRegistryAddressToUse,
                                                       TxConfig.getEthAccounts());

  return JcashRegistrarAddress;
};

const verifyMigrationNumber8 = async () => {
  const jntControllerInstance = await JNTControllerArtifact.deployed();
  const jntControllerAddress = jntControllerInstance.address;

  const jcashRegistrarInstance = await JcashRegistrarArtifact.deployed();
  const jcashRegistrarAddress = jcashRegistrarInstance.address;

  const isVerified1 = await JcashRegistrarInit.verifyManagers(jcashRegistrarAddress, TxConfig.getEthAccounts());
  const isVerified2 = await JcashRegistrarInit.verifyJNTConnection(jcashRegistrarAddress,
                                                                   jntControllerAddress, TxConfig.getEthAccounts(), 10 ** 18);
  if (isVerified1 !== true || isVerified2 !== true) {
    throw new Error('Failed to verify deployed JcashRegistrar');
  }
};


/* Migrations */

export const executeMigration = async (migrationNumber, migrationParams = []) => {
  let result;
  if (migrationNumber === 2) {
    result = await executeMigrationNumber2(...migrationParams);
  } else if (migrationNumber === 3) {
    result = await executeMigrationNumber3(...migrationParams);
  } else if (migrationNumber === 4) {
    result = await executeMigrationNumber4(...migrationParams);
  } else if (migrationNumber === 5) {
    result = await executeMigrationNumber5(...migrationParams);
  } else if (migrationNumber === 6) {
    result = await executeMigrationNumber6(...migrationParams);
  } else if (migrationNumber === 7) {
    result = await executeMigrationNumber7(...migrationParams);
  } else if (migrationNumber === 8) {
    result = await executeMigrationNumber8(...migrationParams);
  } else {
    throw new Error(`Unknown migration to execute: ${migrationNumber}`);
  }
  return result;
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
