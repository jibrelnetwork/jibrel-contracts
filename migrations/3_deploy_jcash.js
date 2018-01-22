global.artifacts = artifacts; // eslint-disable-line no-undef

const migrations = require('../jsroutines/migrations');

module.exports = (deployer) => {
  global.console.log('  Start migration 3');

  deployer.then(() => migrations.executeMigration(3))
          .then(() => migrations.verifyMigration(3))
          .then(() => global.console.log('  Migration 3 finished'));
};
