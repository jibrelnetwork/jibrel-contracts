const deploymentController = require('../deployment_controller');
const ManageableRoutines   = require('./Manageable');
const PausableRoutines     = require('./Pausable');

const CrydrViewBaseInterface = global.artifacts.require('CrydrViewBaseInterface.sol');


export const deployCrydrView = (network, owner, crydrSymbol, crydrViewContract, viewApiStandard) => {
  global.console.log('\tDeploying view of a crydr:');
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tcrydrSymbol - ${crydrSymbol}`);
  global.console.log(`\t\tviewApiStandard - ${viewApiStandard}`);
  return crydrViewContract.new({ from: owner })
    .then((value) => {
      global.console.log(`\tView ${viewApiStandard} of a crydr ${crydrSymbol} successfully deployed: ${value.address}`);
      deploymentController.setCrydrViewAddress(network, crydrSymbol, viewApiStandard, value.address);
      return null;
    });
};

export const deployCrydrViewsList = (network, owner, crydrSymbol, viewStandardToContract) => {
  global.console.log(`\tDeploying ${viewStandardToContract.size} views of a crydr:`);
  global.console.log(`\t\tnetwork - ${network}`);
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tcrydrSymbol - ${crydrSymbol}`);
  const contractPromises = [];
  viewStandardToContract.forEach((contractObj, standardName) => contractPromises.push(
    deployCrydrView(network, owner, crydrSymbol, contractObj, standardName)));
  return Promise
    .all(contractPromises)
    .then(() => {
      global.console.log('\tViews of CryDR successfully deployed');
      return null;
    });
};

export const setControllerOfCrydrView = (manager, crydrControllerAddress, crydrViewAddress) => {
  global.console.log('\tSet controller of CryDR view:');
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\tview - ${crydrViewAddress}`);
  return CrydrViewBaseInterface
    .at(crydrViewAddress)
    .setCrydrController
    .sendTransaction(crydrControllerAddress, { from: manager })
    .then(() => {
      global.console.log('\tController of CryDR view successfully set');
      return null;
    });
};

export const setStorageOfCrydrView = (manager, crydrStorageAddress, crydrViewAddress) => {
  global.console.log('\tSet storage of CryDR view:');
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tview - ${crydrViewAddress}`);
  return CrydrViewBaseInterface
    .at(crydrViewAddress)
    .setCrydrStorage
    .sendTransaction(crydrStorageAddress, { from: manager })
    .then(() => {
      global.console.log('\tStorage of CryDR view successfully set');
      return null;
    });
};

export const configureCrydrView = (network, owner, manager, crydrSymbol, viewApiStandard) => {
  global.console.log(`  Configuring view of a crydr ${crydrSymbol} ...`);
  global.console.log(`\t\tnetwork - ${network}`);
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcrydrSymbol - ${crydrSymbol}`);
  global.console.log(`\t\tstandardName - ${viewApiStandard}`);

  const crydrStorageAddress    = deploymentController.getCrydrStorageAddress(network, crydrSymbol);
  const crydrControllerAddress = deploymentController.getCrydrControllerAddress(network, crydrSymbol);
  const crydrViewAddress       = deploymentController.getCrydrViewAddress(network, crydrSymbol, viewApiStandard);

  const managerPermissions = [
    'set_crydr_controller',
    'set_crydr_storage',
    'pause_contract',
    'unpause_contract'];

  return ManageableRoutines.enableManager(owner, manager, crydrViewAddress)
    .then(() => ManageableRoutines.grantManagerPermissions(owner, manager, crydrViewAddress, managerPermissions))
    .then(() => setControllerOfCrydrView(manager, crydrControllerAddress, crydrViewAddress))
    .then(() => setStorageOfCrydrView(manager, crydrStorageAddress, crydrViewAddress))
    .then(() => PausableRoutines.unpauseContract(manager, crydrViewAddress))
    .then(() => {
      global.console.log(`\tView of a crydr ${crydrSymbol} successfully configured`);
      return null;
    });
};
