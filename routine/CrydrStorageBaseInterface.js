import { SubmitTxAndWaitConfirmation } from './utils/SubmitTx';

const ManageableRoutines   = require('./Manageable');
const PausableRoutines     = require('./Pausable');

const CrydrStorageBaseInterface = global.artifacts.require('CrydrStorageBaseInterface.sol');


export const deployCrydrStorage = async (deployer, crydrStorageContractObject, owner) => {
  global.console.log('\tDeploying storage of a crydr:');
  global.console.log(`\t\towner - ${owner}`);

  await deployer.deploy(crydrStorageContractObject, { from: owner });

  global.console.log('\tStorage of a crydr successfully deployed');
  return null;
};

export const setControllerOfCrydrStorage = async (crydrStorageAddress, manager, crydrControllerAddress) => {
  global.console.log('\tSet controller of CryDR storage:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  await SubmitTxAndWaitConfirmation(
    CrydrStorageBaseInterface
      .at(crydrStorageAddress)
      .setCrydrController
      .sendTransaction,
    [crydrControllerAddress, { from: manager }]);
  global.console.log('\tController of CryDR storage successfully set');
  return null;
};

export const configureCrydrStorage = async (crydrStorageAddress, owner, manager, crydrControllerAddress) => {
  global.console.log('  Configuring storage of a crydr...');
  global.console.log(`\t\tcrydrStorageAddress - ${crydrStorageAddress}`);
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);

  const managerPermissions = [
    'set_crydr_controller',
    'pause_contract',
    'unpause_contract'];

  await ManageableRoutines.enableManager(owner, manager, crydrStorageAddress);
  await ManageableRoutines.grantManagerPermissions(owner, manager, crydrStorageAddress, managerPermissions);
  await setControllerOfCrydrStorage(manager, crydrStorageAddress, crydrControllerAddress);
  await PausableRoutines.unpauseContract(manager, crydrStorageAddress);
  global.console.log('\tStorage of a crydr successfully configured');
  return null;
};
