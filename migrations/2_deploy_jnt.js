global.artifacts = artifacts; // eslint-disable-line no-undef

const migrations = require('../jsroutines/migrations');

module.exports = (deployer) => {
  global.console.log('  Start migration 2');

  deployer.then(() => migrations.executeMigration(2))
          .then(() => migrations.verifyMigration(2))
          .then(() => global.console.log('  Migration 2 finished'));
};
