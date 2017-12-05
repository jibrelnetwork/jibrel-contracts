const ManageableJSAPI = require('../jsapi/lifecycle/Manageable');
const PausableJSAPI = require('../jsapi/lifecycle/Pausable');
const CrydrStorageBaseInterfaceJSAPI = require('../jsapi/crydr/storage/CrydrStorageBaseInterface');

const GlobalConfig = require('./GlobalConfig');


export const deployCrydrStorage = async (crydrStorageContractArtifact) => {
  global.console.log('\tDeploying storage of a crydr.');

  const deployer = GlobalConfig.getDeployer();
  const { owner } = GlobalConfig.getAccounts();
  global.console.log(`\t\towner - ${owner}`);

  await deployer.deploy(crydrStorageContractArtifact, { from: owner });

  const crydrStorageContractInstance = await crydrStorageContractArtifact.deployed();
  const crydrStorageContractAddress = crydrStorageContractInstance.address;

  global.console.log(`\tStorage of a crydr successfully deployed: ${crydrStorageContractAddress}`);
  return null;
};

export const configureCrydrStorageManagers = async (crydrStorageAddress) => {
  global.console.log('\tConfiguring managers of crydr storage...');
  global.console.log(`\t\tcrydrStorageAddress - ${crydrStorageAddress}`);

  const { owner, managerPause, managerGeneral } = GlobalConfig.getAccounts();
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanagerPause - ${managerPause}`);
  global.console.log(`\t\tmanagerGeneral - ${managerGeneral}`);

  await PausableJSAPI.grantManagerPermissions(crydrStorageAddress, owner, managerPause);
  await ManageableJSAPI.enableManager(crydrStorageAddress, owner, managerPause);

  await CrydrStorageBaseInterfaceJSAPI.grantManagerPermissions(crydrStorageAddress, owner, managerGeneral);
  await ManageableJSAPI.enableManager(crydrStorageAddress, owner, managerGeneral);

  global.console.log('\tManagers of crydr storage successfully configured');
  return null;
};

