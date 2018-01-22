/* Migration #2 */

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
  await CrydrInit.upauseCrydrControllerAndStorage(JNTStorage, JNTController);
};

export const verifyMigrationNumber2 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #3 */

const executeMigrationNumber3 = async () => {
  const JNTControllerInstance = await JNTController.deployed();
  const JNTControllerAddress = JNTControllerInstance.address;

  await CrydrInit.initCrydr(jUSDStorage, jUSDController, jUSDViewERC20, 'erc20');
  const jUSDControllerInstance = await jUSDController.deployed();
  const jUSDControllerAddress = jUSDControllerInstance.address;
  await CrydrControllerInit.configureJntPayableService(jUSDControllerAddress, JNTControllerAddress);
  await CrydrInit.upauseCrydrControllerAndStorage(jUSDStorage, jUSDController);

  await CrydrInit.initCrydr(jKRWStorage, jKRWController, jKRWViewERC20, 'erc20');
  const jKRWControllerInstance = await jKRWController.deployed();
  const jKRWControllerAddress = jKRWControllerInstance.address;
  await CrydrControllerInit.configureJntPayableService(jKRWControllerAddress, JNTControllerAddress);
  await CrydrInit.upauseCrydrControllerAndStorage(jKRWStorage, jKRWController);
};

const verifyMigrationNumber3 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #4 */

const executeMigrationNumber4 = async () => {
  await CrydrInit.upauseCrydrView(JNTViewERC20);
};

const verifyMigrationNumber4 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #5 */

const executeMigrationNumber5 = async () => {
  await CrydrInit.upauseCrydrView(jUSDViewERC20);
  await CrydrInit.upauseCrydrView(jKRWViewERC20);
};

const verifyMigrationNumber5 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #6 */

const executeMigrationNumber6 = async () => {
  const { managerMint, testInvestor1, testInvestor2, testInvestor3 } = DeployConfig.getAccounts();
  global.console.log(`\t\tmanagerPause - ${managerMint}`);
  global.console.log(`\t\tmanagerPause - ${testInvestor1}`);
  global.console.log(`\t\tmanagerPause - ${testInvestor2}`);
  global.console.log(`\t\tmanagerPause - ${testInvestor3}`);

  const JNTControllerInstance = await JNTController.deployed();
  const JNTControllerAddress = JNTControllerInstance.address;

  const jUSDControllerInstance = await jUSDController.deployed();
  const jUSDControllerAddress = jUSDControllerInstance.address;

  const jKRWControllerInstance = await jKRWController.deployed();
  const jKRWControllerAddress = jKRWControllerInstance.address;

  await CrydrControllerMintableInterfaceJSAPI.mint(JNTControllerAddress,
                                                   managerMint,
                                                   testInvestor1,
                                                   10000 * (10 ** 18));
  await CrydrControllerMintableInterfaceJSAPI.mint(JNTControllerAddress,
                                                   managerMint,
                                                   testInvestor2,
                                                   10000 * (10 ** 18));
  await CrydrControllerMintableInterfaceJSAPI.mint(JNTControllerAddress,
                                                   managerMint,
                                                   testInvestor3,
                                                   10000 * (10 ** 18));

  await CrydrControllerMintableInterfaceJSAPI.mint(jUSDControllerAddress,
                                                   managerMint,
                                                   testInvestor1,
                                                   10000 * (10 ** 18));
  await CrydrControllerMintableInterfaceJSAPI.mint(jUSDControllerAddress,
                                                   managerMint,
                                                   testInvestor2,
                                                   10000 * (10 ** 18));
  await CrydrControllerMintableInterfaceJSAPI.mint(jUSDControllerAddress,
                                                   managerMint,
                                                   testInvestor3,
                                                   10000 * (10 ** 18));

  await CrydrControllerMintableInterfaceJSAPI.mint(jKRWControllerAddress,
                                                   managerMint,
                                                   testInvestor1,
                                                   10000 * (10 ** 18));
  await CrydrControllerMintableInterfaceJSAPI.mint(jKRWControllerAddress,
                                                   managerMint,
                                                   testInvestor2,
                                                   10000 * (10 ** 18));
  await CrydrControllerMintableInterfaceJSAPI.mint(jKRWControllerAddress,
                                                   managerMint,
                                                   testInvestor3,
                                                   10000 * (10 ** 18));
};

const verifyMigrationNumber6 = async () => {
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
  } else if (migrationNumber === 6) {
    await executeMigrationNumber6();
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
  } else {
    throw new Error(`Unknown migration to execute: ${migrationNumber}`);
  }
};
