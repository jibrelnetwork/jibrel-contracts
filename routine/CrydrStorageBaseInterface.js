const deploymentController = require('../deployment_controller');
const ManageableRoutines   = require('./Manageable');
const PausableRoutines     = require('./Pausable');

const CrydrStorageBaseInterface = global.artifacts.require('CrydrStorageBaseInterface.sol');


export const deployCrydrStorage = (network, owner, crydrSymbol, crydrStorageContract) => {
  global.console.log('\tDeploying storage of a crydr:');
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tcrydrSymbol - ${crydrSymbol}`);
  return crydrStorageContract.new({ from: owner })
    .then((value) => {
      global.console.log(`\tStorage of a crydr ${crydrSymbol} successfully deployed: ${value.address}`);
      deploymentController.setCrydrStorageAddress(network, crydrSymbol, value.address);
      return null;
    });
};

export const setControllerOfCrydrStorage = (manager, crydrStorageAddress, crydrControllerAddress) => {
  global.console.log('\tSet controller of CryDR storage:');
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  return CrydrStorageBaseInterface
    .at(crydrStorageAddress)
    .setCrydrController
    .sendTransaction(crydrControllerAddress, { from: manager })
    .then(() => {
      global.console.log('\tController of CryDR storage successfully set');
      return null;
    });
};

export const configureCrydrStorage = (network, owner, manager, crydrSymbol) => { // eslint-disable-line import/prefer-default-export
  global.console.log(`  Configuring storage of a crydr ${crydrSymbol} ...`);
  global.console.log(`\t\tnetwork - ${network}`);
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcrydrSymbol - ${crydrSymbol}`);

  const crydrStorageAddress    = deploymentController.getCrydrStorageAddress(network, crydrSymbol);
  const crydrControllerAddress = deploymentController.getCrydrControllerAddress(network, crydrSymbol);

  const managerPermissions = [
    'set_crydr_controller',
    'pause_contract',
    'unpause_contract'];

  return ManageableRoutines.enableManager(owner, manager, crydrStorageAddress)
    .then(() => ManageableRoutines.grantManagerPermissions(owner, manager, crydrStorageAddress, managerPermissions))
    .then(() => setControllerOfCrydrStorage(manager, crydrStorageAddress, crydrControllerAddress))
    .then(() => PausableRoutines.unpauseContract(manager, crydrStorageAddress))
    .then(() => {
      global.console.log(`\tStorage of a crydr ${crydrSymbol} successfully configured`);
      return null;
    });
};
