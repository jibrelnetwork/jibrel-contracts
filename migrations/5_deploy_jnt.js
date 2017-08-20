require('babel-register');
require('babel-polyfill');

global.artifacts = artifacts; // eslint-disable-line no-undef

const GlobalConfig = require('../routine/misc/GlobalConfig');
const SubmitTx = require('../routine/misc/SubmitTx');

const JNTStorage    = global.artifacts.require('JNTStorage.sol');
const JNTController = global.artifacts.require('JNTController.sol');
const JNTViewERC20  = global.artifacts.require('JNTViewERC20.sol');

const crydrGeneralRoutines = require('../routine/crydr/CrydrGeneral');


/* Deploy and configure JNT */

const deployJNT = async (deployer, owner, manager) => {
  await crydrGeneralRoutines.deployAndConfigureCrydr(deployer, owner, manager,
                                                     'JNT', 'Jibrel Network Token',
                                                     JNTStorage, JNTController, new Map([['erc20', JNTViewERC20]]),
                                                     false, false, new Map());
};
// todo verify migration


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

  deployer.then(() => deployJNT(deployer, owner, manager));
};
