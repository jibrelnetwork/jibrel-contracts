global.artifacts = artifacts; // eslint-disable-line no-undef

const deploymentController     = require('../deployment_controller');
const InvestorRegistryRoutines = require('../routine/InvestorRegistry');


/* Migration routine */

const migrationRoutine = (network, owner, manager) =>
  InvestorRegistryRoutines.deployInvestorRegistryContract(network, owner)
    .then(() => InvestorRegistryRoutines.enableManager(network, owner, manager))
    .then(() => InvestorRegistryRoutines.grantManagerPermissions(network, owner, manager))
    .then(() => {
      deploymentController.logStorage(network);
      return null;
    });

const verifyRoutine = (network, owner, manager) =>
  InvestorRegistryRoutines.verifyRegistryManager(network, manager);


/* Migration */

module.exports = (deployer, network, accounts) => {
  global.deployer = deployer;

  const owner   = accounts[1];
  const manager = accounts[2];

  global.console.log('  Start migration');
  deployer
    .then(() => migrationRoutine(network, owner, manager))
    .then(() => verifyRoutine(network, owner, manager));
};
