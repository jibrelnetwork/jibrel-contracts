const TxConfig = require('../jsroutines/jsconfig/TxConfig');
const DeployConfig = require('../jsroutines/jsconfig/DeployConfig');

const Migrations = artifacts.require('./Migrations.sol');

global.artifacts = artifacts; // eslint-disable-line no-undef

module.exports = (deployer, network, accounts) => {
  global.console.log('  Start migrations');
  global.console.log(`  Accounts: ${accounts}`);
  global.console.log(`  Network:  ${network}`);

  TxConfig.setWeb3(web3); // eslint-disable-line no-undef
  TxConfig.setNetworkType(network);

  DeployConfig.setDeployer(deployer);
  DeployConfig.setAccounts(accounts);

  deployer.deploy(Migrations);
};
