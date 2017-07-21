global.artifacts = artifacts; // eslint-disable-line no-undef

const deploymentController  = require('../deployment_controller');
const CrydrRegistryRoutines = require('../routine/CryDRRegistry');


/* Migration routine */

const migrationRoutine = (network, owner, manager) =>
  CrydrRegistryRoutines.deployCrydrRegistryContract(network, owner)
    .then(() => CrydrRegistryRoutines.enableManager(network, owner, manager))
    .then(() => CrydrRegistryRoutines.grantManagerPermissions(network, owner, manager))
    .then(() => { deploymentController.logStorage(network); });

// todo verify migration


/* Migration */

module.exports = (deployer, network, accounts) => {
  const owner   = accounts[1];
  const manager = accounts[2];

  global.console.log('  Start migration');
  deployer.then(() => migrationRoutine(network, owner, manager));
};
