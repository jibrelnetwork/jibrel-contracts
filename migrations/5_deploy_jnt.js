global.artifacts = artifacts; // eslint-disable-line no-undef

const JNTStorage    = global.artifacts.require('JNTStorage.sol');
const JNTController = global.artifacts.require('JNTController.sol');
const JNTViewERC20  = global.artifacts.require('JNTViewERC20.sol');

const crydrGeneralRoutines = require('../routine/CrydrGeneral');


/* Deploy and configure JNT */

const deployJNT = (network, owner, manager) =>
  crydrGeneralRoutines.deployAndConfigureCrydr(network, owner, manager, 'JNT', 'Jibrel Network Token',
                                               JNTStorage, JNTController, JNTViewERC20,
                                               false, false, new Map());

// todo verify migration


/* Migration */

module.exports = (deployer, network, accounts) => {
  const owner   = accounts[1];
  const manager = accounts[2];

  global.console.log('  Start migration');
  deployer.then(() => deployJNT(network, owner, manager));
};
