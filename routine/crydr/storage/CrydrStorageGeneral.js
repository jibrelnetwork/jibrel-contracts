const ManageableRoutines                = require('../../lifecycle/Manageable');
const PausableRoutines                  = require('../../lifecycle/Pausable');
const CrydrStorageBaseInterfaceRoutines = require('./CrydrStorageBaseInterface');


/**
 * Configuration
 */

export const deployCrydrStorage = async (deployer, crydrStorageContractArtifact, owner) => {
  global.console.log('\tDeploying storage of a crydr:');
  global.console.log(`\t\towner - ${owner}`);

  await deployer.deploy(crydrStorageContractArtifact, { from: owner });

  global.console.log('\tStorage of a crydr successfully deployed');
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
    'unpause_contract',
    'block_account',
    'unblock_account',
    'block_account_funds',
    'unblock_account_funds',
  ];

  await ManageableRoutines.enableManager(crydrStorageAddress, owner, manager);
  await ManageableRoutines.grantManagerPermissions(crydrStorageAddress, owner, manager, managerPermissions);
  await CrydrStorageBaseInterfaceRoutines.setCrydrController(crydrStorageAddress, manager, crydrControllerAddress);
  await PausableRoutines.unpauseContract(crydrStorageAddress, manager);
  global.console.log('\tStorage of a crydr successfully configured');
};
