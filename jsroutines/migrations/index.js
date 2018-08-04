/* Migration scripts */

const JNTStorageArtifact    = global.artifacts.require('JNTStorage.sol');
const JNTControllerArtifact = global.artifacts.require('JNTController.sol');
const JNTViewERC20Artifact  = global.artifacts.require('JNTViewERC20.sol');

const jUSDStorageArtifact         = global.artifacts.require('jUSDStorage.sol');
const jUSDLicenseRegistryArtifact = global.artifacts.require('jUSDLicenseRegistry.sol');
const jUSDControllerArtifact      = global.artifacts.require('jUSDController.sol');
const jUSDViewERC20Artifact       = global.artifacts.require('jUSDViewERC20.sol');

const jKRWStorageArtifact         = global.artifacts.require('jKRWStorage.sol');
const jKRWLicenseRegistryArtifact = global.artifacts.require('jKRWLicenseRegistry.sol');
const jKRWControllerArtifact      = global.artifacts.require('jKRWController.sol');
const jKRWViewERC20Artifact       = global.artifacts.require('jKRWViewERC20.sol');

const JcashRegistrarArtifact = global.artifacts.require('JcashRegistrar.sol');

const DeployConfig = require('../jsconfig/DeployConfig');
const CrydrInit = require('../jsinit/CrydrInit');
const JcashRegistrarInit = require('../jsinit/JcashRegistrarInit');
const PausableJSAPI = require('../jsapi/lifecycle/Pausable');


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
  /* jUSD */

  await CrydrInit.initLicensedCrydr(jUSDStorageArtifact, jUSDLicenseRegistryArtifact, jUSDControllerArtifact, jUSDViewERC20Artifact, 'erc20');

  await CrydrInit.upauseCrydrContract(jUSDStorageArtifact, 'storage');
  await CrydrInit.upauseCrydrContract(jUSDLicenseRegistryArtifact, 'license_registry');
  await CrydrInit.upauseCrydrContract(jUSDControllerArtifact, 'controller');
  await CrydrInit.upauseCrydrContract(jUSDViewERC20Artifact, 'view');

  const jUSDStorageInstance = await jUSDStorageArtifact.deployed();
  const jUSDStorageAddress = jUSDStorageInstance.address;
  const jUSDLicenseRegistryInstance = await jUSDLicenseRegistryArtifact.deployed();
  const jUSDLicenseRegistryAddress = jUSDLicenseRegistryInstance.address;
  const jUSDControllerInstance = await jUSDControllerArtifact.deployed();
  const jUSDControllerAddress = jUSDControllerInstance.address;
  const jUSDViewERC20Instance = await jUSDViewERC20Artifact.deployed();
  const jUSDViewERC20Address = jUSDViewERC20Instance.address;

  global.console.log('  jUSD deployed, configured and unpaused:');
  global.console.log(`\tjUSDStorageAddress: ${jUSDStorageAddress}`);
  global.console.log(`\tjUSDLicenseRegistryAddress: ${jUSDLicenseRegistryAddress}`);
  global.console.log(`\tjUSDControllerAddress: ${jUSDControllerAddress}`);
  global.console.log(`\tjUSDViewERC20Address: ${jUSDViewERC20Address}`);


  /* jKRW */

  await CrydrInit.initLicensedCrydr(jKRWStorageArtifact, jKRWLicenseRegistryArtifact, jKRWControllerArtifact, jKRWViewERC20Artifact, 'erc20');

  await CrydrInit.upauseCrydrContract(jKRWStorageArtifact, 'storage');
  await CrydrInit.upauseCrydrContract(jKRWLicenseRegistryArtifact, 'license_registry');
  await CrydrInit.upauseCrydrContract(jKRWControllerArtifact, 'controller');
  await CrydrInit.upauseCrydrContract(jKRWViewERC20Artifact, 'view');

  const jKRWStorageInstance = await jKRWStorageArtifact.deployed();
  const jKRWStorageAddress = jKRWStorageInstance.address;
  const jKRWLicenseRegistryInstance = await jKRWLicenseRegistryArtifact.deployed();
  const jKRWLicenseRegistryAddress = jKRWLicenseRegistryInstance.address;
  const jKRWControllerInstance = await jKRWControllerArtifact.deployed();
  const jKRWControllerAddress = jKRWControllerInstance.address;
  const jKRWViewERC20Instance = await jKRWViewERC20Artifact.deployed();
  const jKRWViewERC20Address = jKRWViewERC20Instance.address;

  global.console.log('  jKRW deployed, configured and unpaused:');
  global.console.log(`\tjKRWStorageAddress: ${jKRWStorageAddress}`);
  global.console.log(`\tjKRWLicenseRegistryAddress: ${jKRWLicenseRegistryAddress}`);
  global.console.log(`\tjKRWControllerAddress: ${jKRWControllerAddress}`);
  global.console.log(`\tjKRWViewERC20Address: ${jKRWViewERC20Address}`);
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

  const JNTControllerInstance = await JNTControllerArtifact.deployed();
  const JNTControllerAddress = JNTControllerInstance.address;

  await JcashRegistrarInit.deployJcashRegistrar(JcashRegistrarArtifact, owner);
  const JcashRegistrarInstance = await JcashRegistrarArtifact.deployed();
  const JcashRegistrarAddress = JcashRegistrarInstance.address;

  await JcashRegistrarInit.configureManagers(JcashRegistrarAddress, owner,
                                             managerPause, managerJcashReplenisher, managerJcashExchange);
  await JcashRegistrarInit.configureJNTConnection(JcashRegistrarAddress, owner,
                                                  JNTControllerAddress, managerJNT, jntBeneficiary, 10 ** 18);
  await PausableJSAPI.unpauseContract(JcashRegistrarAddress, managerPause);
};

const verifyMigrationNumber5 = async () => {
  // todo verify migration, make integration tests
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
