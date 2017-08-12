require('babel-register');
require('babel-polyfill');

// todo remove all from global
global.artifacts = artifacts; // eslint-disable-line no-undef

const GlobalConfig = require('../routine/misc/GlobalConfig');
const SubmitTx = require('../routine/misc/SubmitTx');

const InvestorRegistry         = global.artifacts.require('InvestorRegistry.sol');
const InvestorRegistryRoutines = require('../routine/registry/InvestorRegistry');


/* Migration routine */

const migrationRoutine = async (deployer, owner, manager) => {
  await InvestorRegistryRoutines.deployInvestorRegistryContract(deployer, owner);
  const investorRegistryInstance = await InvestorRegistry.deployed();
  await InvestorRegistryRoutines.enableManager(investorRegistryInstance.address, owner, manager);
  await InvestorRegistryRoutines.grantManagerPermissions(investorRegistryInstance.address, owner, manager);
};

const verifyRoutine = async (network, owner, manager) => {
  const investorRegistryInstance = await InvestorRegistry.deployed();
  await InvestorRegistryRoutines.verifyRegistryManager(investorRegistryInstance.address, manager);
};


/* Migration */

module.exports = (deployer, network, accounts) => {
  GlobalConfig.setWeb3(web3); // eslint-disable-line no-undef  // todo do we need it?
  if (network === 'development') {
    SubmitTx.setDefaultWaitParams(
      {
        minConfirmations:   0,
        pollingInterval:    50,
        maxTimeoutMillisec: 60 * 1000,
        maxTimeoutBlocks:   5,
      });
  }

  const owner   = accounts[1];  // todo make some abstraction that will give addresses
  const manager = accounts[2];

  global.console.log('  Start migration');
  global.console.log('  Accounts:');
  global.console.log(`\towner: ${owner}`);
  global.console.log(`\tmanager: ${manager}`);

  deployer
    .then(() => migrationRoutine(deployer, owner, manager))
    .then(() => verifyRoutine(deployer, owner, manager));
};
