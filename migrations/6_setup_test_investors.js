global.artifacts = artifacts; // eslint-disable-line no-undef

const migrations = require('../jsroutines/migrations');

module.exports = (deployer) => {
  global.console.log('  Start migration 6');

  deployer.then(() => migrations.executeMigration(6))
          .then(() => migrations.verifyMigration(6))
          .then(() => global.console.log('  Migration 6 finished'));
};
