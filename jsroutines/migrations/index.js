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

const jDemoStorage         = global.artifacts.require('jDemoStorage.sol');
const jDemoLicenseRegistry = global.artifacts.require('jDemoLicenseRegistry.sol');
const jDemoController      = global.artifacts.require('jDemoController.sol');
const jDemoViewERC20       = global.artifacts.require('jDemoViewERC20.sol');

const DeployConfig = require('../jsconfig/DeployConfig');
const CrydrInit = require('../jsinit/CrydrInit');
const CrydrControllerInit = require('../jsinit/CrydrControllerInit');
const CrydrControllerMintableInterfaceJSAPI = require('../jsapi/crydr/controller/CrydrControllerMintableInterface');
const CrydrControllerLicensedERC20JSAPI = require('../jsapi/crydr/controller/CrydrControllerLicensedERC20');
const CrydrViewERC20NamedInterfaceJSAPI = require('../jsapi/crydr/view/CrydrViewERC20NamedInterface');
const CrydrViewMetadataInterfaceJSAPI = require('../jsapi/crydr/view/CrydrViewMetadataInterface');


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


/* Migration #6 */

const executeMigrationNumber6 = async () => {
  const { managerMint, testInvestor1, testInvestor2, testInvestor3 } = DeployConfig.getAccounts();
  global.console.log(`\t\tmanagerMint - ${managerMint}`);
  global.console.log(`\t\ttestInvestor1 - ${testInvestor1}`);
  global.console.log(`\t\ttestInvestor2 - ${testInvestor2}`);
  global.console.log(`\t\ttestInvestor3 - ${testInvestor3}`);

  const JNTControllerInstance = await JNTController.deployed();
  const JNTControllerAddress = JNTControllerInstance.address;

  const jUSDControllerInstance = await jUSDController.deployed();
  const jUSDControllerAddress = jUSDControllerInstance.address;

  const jKRWControllerInstance = await jKRWController.deployed();
  const jKRWControllerAddress = jKRWControllerInstance.address;

  await Promise.all([
    CrydrControllerMintableInterfaceJSAPI.mint(JNTControllerAddress,
                                               managerMint,
                                               testInvestor1,
                                               10000 * (10 ** 18)),
    CrydrControllerMintableInterfaceJSAPI.mint(JNTControllerAddress,
                                               managerMint,
                                               testInvestor2,
                                               10000 * (10 ** 18)),
    CrydrControllerMintableInterfaceJSAPI.mint(JNTControllerAddress,
                                               managerMint,
                                               testInvestor3,
                                               10000 * (10 ** 18)),

    CrydrControllerMintableInterfaceJSAPI.mint(jUSDControllerAddress,
                                               managerMint,
                                               testInvestor1,
                                               10000 * (10 ** 18)),
    CrydrControllerMintableInterfaceJSAPI.mint(jUSDControllerAddress,
                                               managerMint,
                                               testInvestor2,
                                               10000 * (10 ** 18)),
    CrydrControllerMintableInterfaceJSAPI.mint(jUSDControllerAddress,
                                               managerMint,
                                               testInvestor3,
                                               10000 * (10 ** 18)),

    CrydrControllerMintableInterfaceJSAPI.mint(jKRWControllerAddress,
                                               managerMint,
                                               testInvestor1,
                                               10000 * (10 ** 18)),
    CrydrControllerMintableInterfaceJSAPI.mint(jKRWControllerAddress,
                                               managerMint,
                                               testInvestor2,
                                               10000 * (10 ** 18)),
    CrydrControllerMintableInterfaceJSAPI.mint(jKRWControllerAddress,
                                               managerMint,
                                               testInvestor3,
                                               10000 * (10 ** 18)),
  ]);
};

const verifyMigrationNumber6 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #7 */

export const executeMigrationNumber7 = async () => {
  await CrydrInit.initLicensedCrydr(jDemoStorage, jDemoLicenseRegistry, jDemoController, jDemoViewERC20, 'erc20');

  const JNTControllerInstance = await JNTController.deployed();
  const JNTControllerAddress = JNTControllerInstance.address;

  const jDemoStorageInstance = await jDemoStorage.deployed();
  const jDemoStorageAddress = jDemoStorageInstance.address;
  const jDemoLicenseRegistryInstance = await jDemoLicenseRegistry.deployed();
  const jDemoLicenseRegistryAddress = jDemoLicenseRegistryInstance.address;
  const jDemoControllerInstance = await jDemoController.deployed();
  const jDemoControllerAddress = jDemoControllerInstance.address;
  const jDemoViewERC20Instance = await jDemoViewERC20.deployed();
  const jDemoViewERC20Address = jDemoViewERC20Instance.address;
  await CrydrControllerInit.configureJntPayableService(jDemoControllerAddress, JNTControllerAddress);

  await CrydrInit.upauseCrydrContract(jDemoStorage, 'storage');
  await CrydrInit.upauseCrydrContract(jDemoLicenseRegistry, 'license_registry');
  await CrydrInit.upauseCrydrContract(jDemoController, 'controller');
  await CrydrInit.upauseCrydrContract(jDemoViewERC20, 'view');

  global.console.log('  jDemo deployed, configured and unpaused:');
  global.console.log(`\tjDemoStorageAddress: ${jDemoStorageAddress}`);
  global.console.log(`\tjDemoLicenseRegistryAddress: ${jDemoLicenseRegistryAddress}`);
  global.console.log(`\tjDemoControllerAddress: ${jDemoControllerAddress}`);
  global.console.log(`\tjDemoViewERC20Address: ${jDemoViewERC20Address}`);
};

export const verifyMigrationNumber7 = async () => {
  // todo verify migration, make integration tests
};


/* Migration #8 */

const executeMigrationNumber8 = async () => {
  const { managerGeneral, managerMint, managerLicense,
          testInvestor1, testInvestor2, testInvestor3 } = DeployConfig.getAccounts();


  global.console.log('  Grant licenses to users');

  const licenseRegistryInstance = await jDemoLicenseRegistry.deployed();
  const licenseRegistryAddress = licenseRegistryInstance.address;

  const expirationTimestamp = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);

  await Promise.all([CrydrControllerLicensedERC20JSAPI.licenseUser(licenseRegistryAddress, managerLicense,
                                                                   testInvestor1, expirationTimestamp),
                     CrydrControllerLicensedERC20JSAPI.licenseUser(licenseRegistryAddress, managerLicense,
                                                                   testInvestor2, expirationTimestamp),
                     CrydrControllerLicensedERC20JSAPI.licenseUser(licenseRegistryAddress, managerLicense,
                                                                   testInvestor3, expirationTimestamp)]);


  global.console.log('  Mint tokens');

  const jDemoControllerInstance = await jDemoController.deployed();
  const jDemoControllerAddress = jDemoControllerInstance.address;
  const jDemoViewERC20Instance = await jDemoViewERC20.deployed();
  const jDemoViewERC20Address = jDemoViewERC20Instance.address;

  await Promise.all([
    CrydrControllerMintableInterfaceJSAPI.mint(jDemoControllerAddress,
                                               managerMint,
                                               testInvestor1,
                                               10000 * (10 ** 18)),
    CrydrControllerMintableInterfaceJSAPI.mint(jDemoControllerAddress,
                                               managerMint,
                                               testInvestor2,
                                               10000 * (10 ** 18)),
    CrydrControllerMintableInterfaceJSAPI.mint(jDemoControllerAddress,
                                               managerMint,
                                               testInvestor3,
                                               10000 * (10 ** 18)),
  ]);


  global.console.log('  Change CryDR metadata');
  await CrydrViewERC20NamedInterfaceJSAPI.setSymbol(jDemoViewERC20Address, managerGeneral, 'JGLD');
  await CrydrViewERC20NamedInterfaceJSAPI.setName(jDemoViewERC20Address, managerGeneral, 'jGold asset');
  await CrydrViewMetadataInterfaceJSAPI.setMetadata(jDemoViewERC20Address, managerGeneral,
                                                    'asset_type', 'commodity');
};

const verifyMigrationNumber8 = async () => {
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
