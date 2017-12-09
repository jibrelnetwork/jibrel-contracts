require('babel-register');
require('babel-polyfill');

global.artifacts = artifacts; // eslint-disable-line no-undef


const SubmitTx = require('../jsroutines/jsapi/misc/SubmitTx');

const JNTController = global.artifacts.require('JNTController.sol');

const jUSDStorage    = global.artifacts.require('jUSDStorage.sol');
const jUSDController = global.artifacts.require('jUSDController.sol');
const jUSDViewERC20  = global.artifacts.require('jUSDViewERC20.sol');

const jKRWStorage    = global.artifacts.require('jKRWStorage.sol');
const jKRWController = global.artifacts.require('jKRWController.sol');
const jKRWViewERC20  = global.artifacts.require('jKRWViewERC20.sol');

const DeployConfig = require('../jsroutines/jsconfig/DeployConfig');
const CrydrInit = require('../jsroutines/jsinit/CrydrInit');
const CrydrControllerInit = require('../jsroutines/jsinit/CrydrControllerInit');


/* Migration actions */

const executeMigration = async () => {
  const JNTControllerInstance = await JNTController.deployed();
  const JNTControllerAddress = await JNTControllerInstance.address;

  await CrydrInit.initCrydr(jUSDStorage, jUSDController, jUSDViewERC20, 'erc20');
  const jUSDControllerInstance = await jUSDController.deployed();
  const jUSDControllerAddress = await jUSDControllerInstance.address;
  await CrydrControllerInit.configureJntPayableService(jUSDControllerAddress, JNTControllerAddress);
  await CrydrInit.upauseCrydrControllerAndStorage(jUSDStorage, jUSDController);

  await CrydrInit.initCrydr(jKRWStorage, jKRWController, jKRWViewERC20, 'erc20');
  const jKRWControllerInstance = await jKRWController.deployed();
  const jKRWControllerAddress = await jKRWControllerInstance.address;
  await CrydrControllerInit.configureJntPayableService(jKRWControllerAddress, JNTControllerAddress);
  await CrydrInit.upauseCrydrControllerAndStorage(jKRWStorage, jKRWController);
};

const verifyMigration = async () => {
  // todo verify migration, make integration tests
};


/* Migration */

module.exports = (deployer, network, accounts) => {
  global.console.log('  Start migration');
  global.console.log(`  Accounts: ${accounts}`);
  global.console.log(`  Network:  ${network}`);

  SubmitTx.setWeb3(web3); // eslint-disable-line no-undef
  if (network === 'development' || network === 'coverage') {
    SubmitTx.setDefaultWaitParamsForTestNetwork();
  }

  DeployConfig.setDeployer(deployer);
  DeployConfig.setAccounts(accounts);

  deployer.then(() => executeMigration())
          .then(() => verifyMigration())
          .then(() => global.console.log('  Migration finished'));
};
