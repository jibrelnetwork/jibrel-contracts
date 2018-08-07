/* Migration scripts */

const JNTStorageArtifact    = global.artifacts.require('JNTStorage.sol');
const JNTControllerArtifact = global.artifacts.require('JNTController.sol');
const JNTViewERC20Artifact  = global.artifacts.require('JNTViewERC20.sol');

const jUSDStorageArtifact         = global.artifacts.require('jUSDStorage.sol');
const jUSDLicenseRegistryArtifact = global.artifacts.require('jUSDLicenseRegistry.sol');
const jUSDControllerArtifact      = global.artifacts.require('jUSDController.sol');
const jUSDViewERC20Artifact       = global.artifacts.require('jUSDViewERC20.sol');

const jEURStorageArtifact         = global.artifacts.require('jEURStorage.sol');
const jEURLicenseRegistryArtifact = global.artifacts.require('jEURLicenseRegistry.sol');
const jEURControllerArtifact      = global.artifacts.require('jEURController.sol');
const jEURViewERC20Artifact       = global.artifacts.require('jEURViewERC20.sol');

const jGBPStorageArtifact         = global.artifacts.require('jGBPStorage.sol');
const jGBPLicenseRegistryArtifact = global.artifacts.require('jGBPLicenseRegistry.sol');
const jGBPControllerArtifact      = global.artifacts.require('jGBPController.sol');
const jGBPViewERC20Artifact       = global.artifacts.require('jGBPViewERC20.sol');

const jKRWStorageArtifact         = global.artifacts.require('jKRWStorage.sol');
const jKRWLicenseRegistryArtifact = global.artifacts.require('jKRWLicenseRegistry.sol');
const jKRWControllerArtifact      = global.artifacts.require('jKRWController.sol');
const jKRWViewERC20Artifact       = global.artifacts.require('jKRWViewERC20.sol');

const jJODStorageArtifact         = global.artifacts.require('jJODStorage.sol');
const jJODLicenseRegistryArtifact = global.artifacts.require('jJODLicenseRegistry.sol');
const jJODControllerArtifact      = global.artifacts.require('jJODController.sol');
const jJODViewERC20Artifact       = global.artifacts.require('jJODViewERC20.sol');

const JcashRegistrarArtifact = global.artifacts.require('JcashRegistrar.sol');

const DeployConfig = require('../jsconfig/DeployConfig');
const CrydrInit = require('../jsinit/CrydrInit');
const JcashRegistrarInit = require('../jsinit/JcashRegistrarInit');
const PausableInterfaceJSAPI = require('../../contracts/lifecycle/Pausable/PausableInterface.jsapi');


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


  /* jEUR */

  await CrydrInit.initLicensedCrydr(jEURStorageArtifact, jEURLicenseRegistryArtifact, jEURControllerArtifact, jEURViewERC20Artifact, 'erc20');

  await CrydrInit.upauseCrydrContract(jEURStorageArtifact, 'storage');
  await CrydrInit.upauseCrydrContract(jEURLicenseRegistryArtifact, 'license_registry');
  await CrydrInit.upauseCrydrContract(jEURControllerArtifact, 'controller');
  await CrydrInit.upauseCrydrContract(jEURViewERC20Artifact, 'view');

  const jEURStorageInstance = await jEURStorageArtifact.deployed();
  const jEURStorageAddress = jEURStorageInstance.address;
  const jEURLicenseRegistryInstance = await jEURLicenseRegistryArtifact.deployed();
  const jEURLicenseRegistryAddress = jEURLicenseRegistryInstance.address;
  const jEURControllerInstance = await jEURControllerArtifact.deployed();
  const jEURControllerAddress = jEURControllerInstance.address;
  const jEURViewERC20Instance = await jEURViewERC20Artifact.deployed();
  const jEURViewERC20Address = jEURViewERC20Instance.address;

  global.console.log('  jEUR deployed, configured and unpaused:');
  global.console.log(`\tjEURStorageAddress: ${jEURStorageAddress}`);
  global.console.log(`\tjEURLicenseRegistryAddress: ${jEURLicenseRegistryAddress}`);
  global.console.log(`\tjEURControllerAddress: ${jEURControllerAddress}`);
  global.console.log(`\tjEURViewERC20Address: ${jEURViewERC20Address}`);


  /* jGBP */

  await CrydrInit.initLicensedCrydr(jGBPStorageArtifact, jGBPLicenseRegistryArtifact, jGBPControllerArtifact, jGBPViewERC20Artifact, 'erc20');

  await CrydrInit.upauseCrydrContract(jGBPStorageArtifact, 'storage');
  await CrydrInit.upauseCrydrContract(jGBPLicenseRegistryArtifact, 'license_registry');
  await CrydrInit.upauseCrydrContract(jGBPControllerArtifact, 'controller');
  await CrydrInit.upauseCrydrContract(jGBPViewERC20Artifact, 'view');

  const jGBPStorageInstance = await jGBPStorageArtifact.deployed();
  const jGBPStorageAddress = jGBPStorageInstance.address;
  const jGBPLicenseRegistryInstance = await jGBPLicenseRegistryArtifact.deployed();
  const jGBPLicenseRegistryAddress = jGBPLicenseRegistryInstance.address;
  const jGBPControllerInstance = await jGBPControllerArtifact.deployed();
  const jGBPControllerAddress = jGBPControllerInstance.address;
  const jGBPViewERC20Instance = await jGBPViewERC20Artifact.deployed();
  const jGBPViewERC20Address = jGBPViewERC20Instance.address;

  global.console.log('  jGBP deployed, configured and unpaused:');
  global.console.log(`\tjGBPStorageAddress: ${jGBPStorageAddress}`);
  global.console.log(`\tjGBPLicenseRegistryAddress: ${jGBPLicenseRegistryAddress}`);
  global.console.log(`\tjGBPControllerAddress: ${jGBPControllerAddress}`);
  global.console.log(`\tjGBPViewERC20Address: ${jGBPViewERC20Address}`);


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


  /* jJOD */

  await CrydrInit.initLicensedCrydr(jJODStorageArtifact, jJODLicenseRegistryArtifact, jJODControllerArtifact, jJODViewERC20Artifact, 'erc20');

  await CrydrInit.upauseCrydrContract(jJODStorageArtifact, 'storage');
  await CrydrInit.upauseCrydrContract(jJODLicenseRegistryArtifact, 'license_registry');
  await CrydrInit.upauseCrydrContract(jJODControllerArtifact, 'controller');
  await CrydrInit.upauseCrydrContract(jJODViewERC20Artifact, 'view');

  const jJODStorageInstance = await jJODStorageArtifact.deployed();
  const jJODStorageAddress = jJODStorageInstance.address;
  const jJODLicenseRegistryInstance = await jJODLicenseRegistryArtifact.deployed();
  const jJODLicenseRegistryAddress = jJODLicenseRegistryInstance.address;
  const jJODControllerInstance = await jJODControllerArtifact.deployed();
  const jJODControllerAddress = jJODControllerInstance.address;
  const jJODViewERC20Instance = await jJODViewERC20Artifact.deployed();
  const jJODViewERC20Address = jJODViewERC20Instance.address;

  global.console.log('  jJOD deployed, configured and unpaused:');
  global.console.log(`\tjJODStorageAddress: ${jJODStorageAddress}`);
  global.console.log(`\tjJODLicenseRegistryAddress: ${jJODLicenseRegistryAddress}`);
  global.console.log(`\tjJODControllerAddress: ${jJODControllerAddress}`);
  global.console.log(`\tjJODViewERC20Address: ${jJODViewERC20Address}`);
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
