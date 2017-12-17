require('babel-register');
require('babel-polyfill');

global.artifacts = artifacts; // eslint-disable-line no-undef


const TxConfig = require('../jsroutines/jsconfig/TxConfig');
const DeployConfig = require('../jsroutines/jsconfig/DeployConfig');
const migrations = require('../jsroutines/migrations');


/* Migration */

module.exports = (deployer, network, accounts) => {
  global.console.log('  Start migration');
  global.console.log(`  Accounts: ${accounts}`);
  global.console.log(`  Network:  ${network}`);

  TxConfig.setWeb3(web3); // eslint-disable-line no-undef
  TxConfig.setNetworkType(network);

  DeployConfig.setDeployer(deployer);
  DeployConfig.setAccounts(accounts);

  deployer.then(() => migrations.executeMigration(5))
          .then(() => migrations.verifyMigration(5))
          .then(() => global.console.log('  Migration finished'));
};
