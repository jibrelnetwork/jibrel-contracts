const initConfig = require('../jsroutines/jsconfig/initConfig');

global.artifacts = artifacts; // eslint-disable-line no-undef

const Migrations = global.artifacts.require('./Migrations.sol');

module.exports = (deployer, network, accounts) => {
  global.console.log('  Start migrations');

  initConfig(web3, deployer, network, accounts); // eslint-disable-line no-undef

  deployer.deploy(Migrations);
};
