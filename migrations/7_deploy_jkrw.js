global.artifacts = artifacts; // eslint-disable-line no-undef

const migrations = require('../jsroutines/migrations');
const initConfig = require('../jsroutines/jsconfig/initConfig');


module.exports = (deployer, network, accounts) => {
  global.console.log('  Start migration 7');

  initConfig(web3, deployer, network, accounts); // eslint-disable-line no-undef

  deployer
    .then(() => migrations.executeMigration(7))
    .then(() => migrations.verifyMigration(7))
    .then(() => global.console.log('  Migration 7 finished'));
};
