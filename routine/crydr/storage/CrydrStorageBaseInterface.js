import { submitTxAndWaitConfirmation } from '../../misc/SubmitTx';

const ManageableRoutines   = require('../../lifecycle/Manageable');
const PausableRoutines     = require('../../lifecycle/Pausable');

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
  await submitTxAndWaitConfirmation(
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

  await ManageableRoutines.enableManager(crydrStorageAddress, owner, manager);
  await ManageableRoutines.grantManagerPermissions(crydrStorageAddress, owner, manager, managerPermissions);
  await setControllerOfCrydrStorage(crydrStorageAddress, manager, crydrControllerAddress);
  await PausableRoutines.unpauseContract(crydrStorageAddress, manager);
  global.console.log('\tStorage of a crydr successfully configured');
  return null;
};
