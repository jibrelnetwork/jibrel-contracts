import { SubmitTxAndWaitConfirmation } from './utils/SubmitTx';

const ManageableRoutines   = require('./Manageable');
const PausableRoutines     = require('./Pausable');

const CrydrViewBaseInterface = global.artifacts.require('CrydrViewBaseInterface.sol');


export const deployCrydrView = async (deployer, crydrViewContractObject, owner, viewApiStandard) => {
  global.console.log('\tDeploying view of a crydr:');
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tviewApiStandard - ${viewApiStandard}`);

  await deployer.deploy(crydrViewContractObject, { from: owner });

  global.console.log('\tView of a crydr successfully deployed');
  return null;
};

export const deployCrydrViewsList = async (deployer, viewStandardToContractObject, owner) => {
  global.console.log(`\tDeploying ${viewStandardToContractObject.size} views of a crydr:`);
  global.console.log(`\t\towner - ${owner}`);
  const contractPromises = [];
  viewStandardToContractObject.forEach((contractObj, standardName) => contractPromises.push(
    deployCrydrView(deployer, contractObj, owner, standardName)));
  await Promise.all(contractPromises);
  global.console.log('\tViews of CryDR successfully deployed');
  return null;
};

export const setControllerOfCrydrView = async (crydrViewAddress, manager, crydrControllerAddress) => {
  global.console.log('\tSet controller of CryDR view:');
  global.console.log(`\t\tview - ${crydrViewAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);

  await SubmitTxAndWaitConfirmation(
    CrydrViewBaseInterface
      .at(crydrViewAddress)
      .setCrydrController
      .sendTransaction,
    [crydrControllerAddress, { from: manager }]);
  global.console.log('\tController of CryDR view successfully set');
  return null;
};

export const setStorageOfCrydrView = async (crydrViewAddress, manager, crydrStorageAddress) => {
  global.console.log('\tSet storage of CryDR view:');
  global.console.log(`\t\tview - ${crydrViewAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  await SubmitTxAndWaitConfirmation(
    CrydrViewBaseInterface
      .at(crydrViewAddress)
      .setCrydrStorage
      .sendTransaction,
    [crydrStorageAddress, { from: manager }]);
  global.console.log('\tStorage of CryDR view successfully set');
  return null;
};

export const configureCrydrView = async (crydrViewAddress, owner, manager,
                                         crydrStorageAddress, crydrControllerAddress) => {
  global.console.log('  Configuring view of a crydr ...');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcrydrStorageAddress - ${crydrStorageAddress}`);
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);

  const managerPermissions = [
    'set_crydr_controller',
    'set_crydr_storage',
    'pause_contract',
    'unpause_contract'];

  await ManageableRoutines.enableManager(owner, manager, crydrViewAddress);
  await ManageableRoutines.grantManagerPermissions(owner, manager, crydrViewAddress, managerPermissions);
  await setControllerOfCrydrView(manager, crydrControllerAddress, crydrViewAddress);
  await setStorageOfCrydrView(manager, crydrStorageAddress, crydrViewAddress);
  await PausableRoutines.unpauseContract(manager, crydrViewAddress);

  global.console.log('\tView of a crydr successfully configured');
  return null;
};
