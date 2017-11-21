require('babel-register');
require('babel-polyfill');

global.artifacts = artifacts; // eslint-disable-line no-undef

const GlobalConfig = require('../routine/misc/GlobalConfig');
const SubmitTx     = require('../routine/misc/SubmitTx');

const jGBPStorage    = global.artifacts.require('jGBPStorage.sol');
const jGBPController = global.artifacts.require('jGBPController.sol');
const jGBPViewERC20  = global.artifacts.require('jGBPViewERC20.sol');

const JNTController = global.artifacts.require('JNTController.sol');

const crydrGeneralRoutines           = require('../routine/crydr/CrydrGeneral');
const JNTControllerInterfaceRoutines = require('../routine/crydr/jnt/JNTControllerInterface');


/* Deploy and configure fiat CryDRs */

const deployJGBP = (deployer, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(deployer, owner, manager,
                                               'jGBP', 'Pound sterling',
                                               jGBPStorage, jGBPController, new Map([['erc20', jGBPViewERC20]]),
                                               false, true, crydrGeneralRoutines.jntPrices);


/* Migration routine */

const migrationRoutine = async (deployer, owner, manager) => {
  await deployJGBP(deployer, owner, manager);
};

const verifyRoutine = async () => {
  global.console.log(' Verify Deployed jGBP');

  const jntControllerInstance = await JNTController.deployed();
  const jntControllerAddress  = jntControllerInstance.address;

  const payableServiceInstance = await jGBPController.deployed();
  await JNTControllerInterfaceRoutines.verifyPayableService(jntControllerAddress, payableServiceInstance.address);
};

/* Migration */

module.exports = (deployer, network, accounts) => {
  GlobalConfig.setWeb3(web3); // eslint-disable-line no-undef
  if (network === 'development' || network === 'coverage') {
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
