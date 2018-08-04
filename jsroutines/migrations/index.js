/* Migration scripts */

const JNTStorage    = global.artifacts.require('JNTStorage.sol');
const JNTController = global.artifacts.require('JNTController.sol');
const JNTViewERC20  = global.artifacts.require('JNTViewERC20.sol');

const jUSDStorage    = global.artifacts.require('jUSDStorage.sol');
const jUSDController = global.artifacts.require('jUSDController.sol');
const jUSDViewERC20  = global.artifacts.require('jUSDViewERC20.sol');

const jKRWStorage    = global.artifacts.require('jKRWStorage.sol');
const jKRWController = global.artifacts.require('jKRWController.sol');
const jKRWViewERC20  = global.artifacts.require('jKRWViewERC20.sol');

const DeployConfig = require('../jsconfig/DeployConfig');
const CrydrInit = require('../jsinit/CrydrInit');
const CrydrControllerInit = require('../jsinit/CrydrControllerInit');
const CrydrControllerMintableInterfaceJSAPI = require('../jsapi/crydr/controller/CrydrControllerMintableInterface');


/* Migration #2 */

export const executeMigrationNumber2 = async () => {
  await CrydrInit.initCrydr(JNTStorage, JNTController, JNTViewERC20, 'erc20');
  await CrydrInit.upauseCrydrContract(JNTStorage, 'storage');
  await CrydrInit.upauseCrydrContract(JNTController, 'controller');
};

export const verifyMigrationNumber2 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #3 */

const executeMigrationNumber3 = async () => {
  await CrydrInit.upauseCrydrContract(JNTViewERC20, 'view');
};

const verifyMigrationNumber3 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #3 */

const executeMigrationNumber4 = async () => {
  const JNTControllerInstance = await JNTController.deployed();
  const JNTControllerAddress = JNTControllerInstance.address;

  await CrydrInit.initCrydr(jUSDStorage, jUSDController, jUSDViewERC20, 'erc20');
  const jUSDControllerInstance = await jUSDController.deployed();
  const jUSDControllerAddress = jUSDControllerInstance.address;
  await CrydrControllerInit.configureJntPayableService(jUSDControllerAddress, JNTControllerAddress);
  await CrydrInit.upauseCrydrContract(jUSDStorage, 'storage');
  await CrydrInit.upauseCrydrContract(jUSDController, 'controller');

  await CrydrInit.initCrydr(jKRWStorage, jKRWController, jKRWViewERC20, 'erc20');
  const jKRWControllerInstance = await jKRWController.deployed();
  const jKRWControllerAddress = jKRWControllerInstance.address;
  await CrydrControllerInit.configureJntPayableService(jKRWControllerAddress, JNTControllerAddress);
  await CrydrInit.upauseCrydrContract(jKRWStorage, 'storage');
  await CrydrInit.upauseCrydrContract(jKRWController, 'controller');
};

const verifyMigrationNumber4 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #5 */

const executeMigrationNumber5 = async () => {
  await CrydrInit.upauseCrydrContract(jUSDViewERC20, 'view');
  await CrydrInit.upauseCrydrContract(jKRWViewERC20, 'view');
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
