require('babel-register');
require('babel-polyfill');

global.artifacts = artifacts; // eslint-disable-line no-undef

const GlobalConfig = require('../routine/misc/GlobalConfig');
const SubmitTx     = require('../routine/misc/SubmitTx');

const jUSDStorage    = global.artifacts.require('jUSDStorage.sol');
const jUSDController = global.artifacts.require('jUSDController.sol');
const jUSDViewERC20  = global.artifacts.require('jUSDViewERC20.sol');

const JNTController = global.artifacts.require('JNTController.sol');

const crydrGeneralRoutines           = require('../routine/crydr/CrydrGeneral');
const JNTControllerInterfaceRoutines = require('../routine/crydr/jnt/JNTControllerInterface');


/* Deploy and configure fiat CryDRs */

const deployJUSD = (deployer, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(deployer, owner, manager,
                                               'jUSD', 'United States dollar',
                                               jUSDStorage, jUSDController, new Map([['erc20', jUSDViewERC20]]),
                                               false, true, crydrGeneralRoutines.jntPrices);


/* Migration routine */

const migrationRoutine = async (deployer, owner, manager) => {
  await deployJUSD(deployer, owner, manager);
};

const verifyRoutine = async () => {
  global.console.log(' Verify Deployed jUSD');

  const jntControllerInstance = await JNTController.deployed();
  const jntControllerAddress  = jntControllerInstance.address;

  const payableServiceInstance = await jUSDController.deployed();
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
