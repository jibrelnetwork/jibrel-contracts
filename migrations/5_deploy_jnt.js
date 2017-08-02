require('babel-register');
require('babel-polyfill');

global.artifacts = artifacts; // eslint-disable-line no-undef

const GlobalConfig = require('../routine/utils/GlobalConfig');
const SubmitTx = require('../routine/utils/SubmitTx');

const JNTStorage    = global.artifacts.require('JNTStorage.sol');
const JNTController = global.artifacts.require('JNTController.sol');
const JNTViewERC20  = global.artifacts.require('JNTViewERC20.sol');

const crydrGeneralRoutines = require('../routine/CrydrGeneral');


/* Deploy and configure JNT */

const deployJNT = async (deployer, owner, manager) => {
  await crydrGeneralRoutines.deployAndConfigureCrydr(deployer, owner, manager,
                                                     'JNT', 'Jibrel Network Token',
                                                     JNTStorage, JNTController, JNTViewERC20,
                                                     false, false, new Map());
};
// todo verify migration


/* Migration */

module.exports = (deployer, network, accounts) => {
  GlobalConfig.setWeb3(web3); // eslint-disable-line no-undef
  if (network === 'development') {
    SubmitTx.setDefaultWaitParams(
      {
        minConfirmations:   1,
        pollingInterval:    500,
        maxTimeoutMillisec: 60 * 1000,
        maxTimeoutBlocks:   5,
      });
  }

  const owner   = accounts[1];
  const manager = accounts[2];

  global.console.log('  Start migration');
  deployer.then(() => deployJNT(deployer, owner, manager));
};
