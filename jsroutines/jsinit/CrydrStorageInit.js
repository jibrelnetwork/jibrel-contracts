const ManageableJSAPI = require('../jsapi/lifecycle/Manageable');
const PausableJSAPI = require('../jsapi/lifecycle/Pausable');
const CrydrStorageBaseInterfaceJSAPI = require('../jsapi/crydr/storage/CrydrStorageBaseInterface');

const DeployConfig = require('../jsconfig/DeployConfig');

const DeployUtils = require('../util/DeployUtils');


export const deployCrydrStorage = async (crydrStorageContractArtifact) => {
  global.console.log('\tDeploying storage of a crydr.');

  const contractAddress = await DeployUtils.deployContract(crydrStorageContractArtifact);

  global.console.log(`\tStorage of a crydr successfully deployed: ${contractAddress}`);

  return null;
};

export const configureCrydrStorageManagers = async (crydrStorageAddress) => {
  global.console.log('\tConfiguring managers of crydr storage...');
  global.console.log(`\t\tcrydrStorageAddress - ${crydrStorageAddress}`);

  const { owner, managerPause, managerGeneral } = DeployConfig.getAccounts();
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

