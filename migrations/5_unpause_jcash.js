global.artifacts = artifacts; // eslint-disable-line no-undef

const migrations = require('../jsroutines/migrations');

module.exports = (deployer) => {
  global.console.log('  Start migration 5');

  deployer.then(() => migrations.executeMigration(5))
          .then(() => migrations.verifyMigration(5))
          .then(() => global.console.log('  Migration 5 finished'));
};
