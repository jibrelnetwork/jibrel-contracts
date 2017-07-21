global.artifacts = artifacts; // eslint-disable-line no-undef

const deploymentController = require('../deployment_controller');
const JibrelAPIRoutines    = require('../routine/JibrelAPI');


/* Migration routine */

const migrationRoutine = (network, owner, manager) =>
  JibrelAPIRoutines.deployJibrelAPIContract(network, owner)
    .then(() => JibrelAPIRoutines.enableManager(network, owner, manager))
    .then(() => JibrelAPIRoutines.grantManagerPermissions(network, owner, manager))
    .then(() => { deploymentController.logStorage(network); });

// todo verify migration


/* Migration */

module.exports = (deployer, network, accounts) => {
  const owner   = accounts[1];
  const manager = accounts[2];

  global.console.log('  Start migration');
  deployer.then(() => migrationRoutine(network, owner, manager));
};
