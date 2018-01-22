const migrations = require('../jsroutines/migrations');
const initConfig = require('../jsroutines/jsconfig/initConfig');

global.artifacts = artifacts; // eslint-disable-line no-undef

module.exports = (deployer, network, accounts) => {
  global.console.log('  Start migration 6');

  initConfig(web3, deployer, network, accounts); // eslint-disable-line no-undef

  deployer
    .then(() => migrations.executeMigration(6))
    .then(() => migrations.verifyMigration(6))
    .then(() => global.console.log('  Migration 6 finished'));
};
