require('babel-register');
require('babel-polyfill');

global.artifacts = artifacts; // eslint-disable-line no-undef

const GlobalConfig = require('../routine/misc/GlobalConfig');
const SubmitTx     = require('../routine/misc/SubmitTx');

const jTBillStorage              = global.artifacts.require('jTBillStorage.sol');
const jTBillController           = global.artifacts.require('jTBillController.sol');
const jTBillViewERC20            = global.artifacts.require('jTBillViewERC20.sol');
const jTBillViewERC20Validatable = global.artifacts.require('jTBillViewERC20Validatable.sol');

const JNTController = global.artifacts.require('JNTController.sol');

const crydrGeneralRoutines           = require('../routine/crydr/CrydrGeneral');
const JNTControllerInterfaceRoutines = require('../routine/crydr/jnt/JNTControllerInterface');


/* Deploy and configure fiat CryDRs */

const deployJTBill = (deployer, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(deployer, owner, manager,
                                               'jTBill', 'Treasure bill',
                                               jTBillStorage,
                                               jTBillController,
                                               new Map([
                                                         [
                                                           'erc20',
                                                           jTBillViewERC20],
                                                         [
                                                           'erc20__validatable',
                                                           jTBillViewERC20Validatable]]),
                                               true, true, crydrGeneralRoutines.jntPrices);


/* Migration routine */

const migrationRoutine = async (deployer, owner, manager) => {
  await deployJTBill(deployer, owner, manager);
};

const verifyRoutine = async () => {
  global.console.log(' Verify Deployed jTBill');

  const jntControllerInstance = await JNTController.deployed();
  const jntControllerAddress  = jntControllerInstance.address;

  const payableServiceInstance = await jTBillController.deployed();
  await JNTControllerInterfaceRoutines.verifyPayableService(jntControllerAddress, payableServiceInstance.address);
};

/* Migration */

module.exports = (deployer, network, accounts) => {
  GlobalConfig.setWeb3(web3); // eslint-disable-line no-undef
  if (network === 'development') {
    SubmitTx.setDefaultWaitParams(
      {
        minConfirmations:   0,
        pollingInterval:    50,
        maxTimeoutMillisec: 60 * 1000,
        maxTimeoutBlocks:   5,
      });
  }

  const owner   = accounts[1];
  const manager = accounts[2];

  global.console.log('  Start migration');
  global.console.log('  Accounts:');
  global.console.log(`\towner: ${owner}`);
  global.console.log(`\tmanager: ${manager}`);

  deployer
    .then(() => migrationRoutine(deployer, owner, manager))
    .then(() => verifyRoutine());
};
