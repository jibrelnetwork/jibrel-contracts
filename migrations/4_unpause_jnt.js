global.artifacts = artifacts; // eslint-disable-line no-undef

const migrations = require('../jsroutines/migrations');
const initConfig = require('../jsroutines/jsconfig/initConfig');


module.exports = (deployer, network, accounts) => {
  global.console.log('  Start migration 4');

  initConfig(web3, deployer, network, accounts); // eslint-disable-line no-undef

  deployer
    .then(() => migrations.executeMigration(4))
    .then(() => migrations.verifyMigration(4))
    .then(() => global.console.log('  Migration 4 finished'));
};
