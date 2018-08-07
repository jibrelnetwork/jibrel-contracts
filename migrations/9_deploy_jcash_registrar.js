global.artifacts = artifacts; // eslint-disable-line no-undef

const migrations = require('../jsroutines/migrations');
const initConfig = require('../jsroutines/jsconfig/initConfig');


module.exports = (deployer, network, accounts) => {
  global.console.log('  Start migration 9');

  initConfig(web3, deployer, network, accounts); // eslint-disable-line no-undef

  deployer
    .then(() => migrations.executeMigration(9))
    .then(() => migrations.verifyMigration(9))
    .then(() => global.console.log('  Migration 9 finished'));
};
