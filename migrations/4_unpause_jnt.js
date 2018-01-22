global.artifacts = artifacts; // eslint-disable-line no-undef

const migrations = require('../jsroutines/migrations');

module.exports = (deployer) => {
  global.console.log('  Start migration 4');

  deployer.then(() => migrations.executeMigration(4))
          .then(() => migrations.verifyMigration(4))
          .then(() => global.console.log('  Migration 4 finished'));
};
