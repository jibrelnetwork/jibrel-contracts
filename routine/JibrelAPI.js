const JibrelAPI = global.artifacts.require('JibrelAPI.sol');

const deploymentController = require('../deployment_controller');
const ManageableRoutines   = require('./Manageable');


/* Migration promises */

export const deployJibrelAPIContract = (network, owner) => {
  global.console.log('  Deploying JibrelAPI ...');
  global.console.log(`\t\tnetwork - ${network}`);
  global.console.log(`\t\towner - ${owner}`);
  return JibrelAPI.new(owner,
                       owner,
                       deploymentController.getInvestorRegistryAddress(network),
                       deploymentController.getCrydrRegistryAddress(network),
                       { from: owner })
    .then((value) => {
      global.console.log(`\tJibrelAPI successfully deployed: ${value.address}`);
      deploymentController.setJibrelApiAddress(network, value.address);
      return null;
    });
};

export const enableManager = (network, owner, manager) => {
  global.console.log('\tEnable manager of JibrelAPI ...');
  return ManageableRoutines
    .enableManager(owner, manager, deploymentController.getJibrelApiAddress(network));
};

export const grantManagerPermissions = (network, owner, manager) => {
  global.console.log('\tGrant permissions to manager of JibrelAPI ...');
  const permissions = [
    'set_bodc',
    'set_jibrel_dao',
    'set_investor_repo',
    'set_crydr_repo'];
  return ManageableRoutines
    .grantManagerPermissions(owner, manager,
                             deploymentController.getJibrelApiAddress(network),
                             permissions);
};
