require('babel-register');
require('babel-polyfill');

global.artifacts = artifacts; // eslint-disable-line no-undef

const GlobalConfig = require('../routine/misc/GlobalConfig');
const SubmitTx = require('../routine/misc/SubmitTx');

const JibrelAPI         = global.artifacts.require('JibrelAPI.sol');
const JibrelAPIRoutines = require('../routine/api/JibrelAPI');


/* Migration routine */

const migrationRoutine = async (deployer, owner, manager) => {
  await JibrelAPIRoutines.deployJibrelAPIContract(deployer, owner);
  const jibrelAPIInstance = await JibrelAPI.deployed();
  await JibrelAPIRoutines.enableManager(jibrelAPIInstance.address, owner, manager);
  await JibrelAPIRoutines.grantManagerPermissions(jibrelAPIInstance.address, owner, manager);
};
// todo verify migration


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

  deployer.then(() => migrationRoutine(deployer, owner, manager));
};
