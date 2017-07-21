const CryDRRegistryManagementInterface = global.artifacts.require('CryDRRegistryManagementInterface.sol');
const CryDRRegistry                    = global.artifacts.require('CryDRRegistry.sol');

const deploymentController = require('../deployment_controller');
const ManageableRoutines   = require('./Manageable');


/* Migration promises */

export const deployCrydrRegistryContract = (network, owner) => {
  global.console.log('\tDeploying CryDRRegistry ...');
  global.console.log(`\t\tnetwork - ${network}`);
  global.console.log(`\t\towner - ${owner}`);
  return CryDRRegistry.new({ from: owner })
    .then((value) => {
      global.console.log(`\tCryDRRegistry successfully deployed: ${value.address}`);
      deploymentController.setCrydrRegistryAddress(network, value.address);
      return null;
    });
};

export const enableManager = (network, owner, manager) => {
  global.console.log('\tEnable manager of CryDRRegistry ...');
  return ManageableRoutines
    .enableManager(owner, manager, deploymentController.getCrydrRegistryAddress(network));
};

export const grantManagerPermissions = (network, owner, manager) => {
  global.console.log('\tGrant permissions to manager of CryDRRegistry ...');
  const permissions = [
    'add_crydr',
    'remove_crydr'];
  return ManageableRoutines
    .grantManagerPermissions(owner, manager,
                             deploymentController.getCrydrRegistryAddress(network),
                             permissions);
};

export const registerCrydr = (network, manager, crydrSymbol, crydrName) => {
  global.console.log('\tRegister crydr in a registry');
  global.console.log(`\t\tnetwork - ${network}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcrydrSymbol - ${crydrSymbol}`);
  global.console.log(`\t\tcrydrName - ${crydrName}`);
  return CryDRRegistryManagementInterface
    .at(deploymentController.getCrydrRegistryAddress(network))
    .addCrydr
    .sendTransaction(crydrSymbol, crydrName, deploymentController.getCrydrControllerAddress(network, crydrSymbol),
                     { from: manager })
    .then(() => {
      global.console.log('\t\tCrydr successfully registered');
      return null;
    });
};
