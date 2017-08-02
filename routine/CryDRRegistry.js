import { SubmitTxAndWaitConfirmation } from './utils/SubmitTx';

const CryDRRegistryManagementInterface = global.artifacts.require('CryDRRegistryManagementInterface.sol');
const CryDRRegistry                    = global.artifacts.require('CryDRRegistry.sol');

const ManageableRoutines   = require('./Manageable');


/* Migration promises */

export const deployCrydrRegistryContract = async (deployer, owner) => {
  global.console.log('\tDeploying CryDRRegistry ...');
  global.console.log(`\t\towner - ${owner}`);
  await deployer.deploy(CryDRRegistry, { from: owner });
  return null;
};

export const enableManager = (crydrRegistryAddress, owner, manager) => {
  global.console.log('\tEnable manager of CryDRRegistry ...');
  return ManageableRoutines.enableManager(crydrRegistryAddress, owner, manager);
};

export const grantManagerPermissions = (crydrRegistryAddress, owner, manager) => {
  global.console.log('\tGrant permissions to manager of CryDRRegistry ...');
  const permissions = [
    'add_crydr',
    'remove_crydr'];
  return ManageableRoutines.grantManagerPermissions(crydrRegistryAddress, owner, manager, permissions);
};

export const registerCrydr = async (crydrRegistryAddress, manager, crydrSymbol, crydrName, crydrControllerAddress) => {
  global.console.log('\tRegister crydr in a registry');
  global.console.log(`\t\tcrydrRegistryAddress - ${crydrRegistryAddress}`);
  global.console.log(`\t\tmanager - ${manager}`);
  global.console.log(`\t\tcrydrSymbol - ${crydrSymbol}`);
  global.console.log(`\t\tcrydrName - ${crydrName}`);
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  await SubmitTxAndWaitConfirmation(
    CryDRRegistryManagementInterface
      .at(crydrRegistryAddress)
      .addCrydr
      .sendTransaction,
    [crydrSymbol, crydrName, crydrControllerAddress, { from: manager }]
  );
  global.console.log('\t\tCrydr successfully registered');
  return null;
};
