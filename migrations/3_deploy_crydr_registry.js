require('babel-register');
require('babel-polyfill');

global.artifacts = artifacts; // eslint-disable-line no-undef

const GlobalConfig = require('../routine/utils/GlobalConfig');
const SubmitTx     = require('../routine/utils/SubmitTx');

const CryDRRegistry         = global.artifacts.require('CryDRRegistry.sol');
const CrydrRegistryRoutines = require('../routine/CryDRRegistry');


/* Migration routine */

const migrationRoutine = async (deployer, owner, manager) => {
  await CrydrRegistryRoutines.deployCrydrRegistryContract(deployer, owner);
  const crydrRegistryInstance = await CryDRRegistry.deployed();
  await CrydrRegistryRoutines.enableManager(crydrRegistryInstance.address, owner, manager);
  await CrydrRegistryRoutines.grantManagerPermissions(crydrRegistryInstance.address, owner, manager);
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
