const ManageableJSAPI = require('../../contracts/lifecycle/Manageable/Manageable.jsapi');
const PausableJSAPI = require('../../contracts/lifecycle/Pausable/Pausable.jsapi');
const CrydrStorageBaseJSAPI = require('../../contracts/crydr/storage/CrydrStorageBase/CrydrStorageBase.jsapi');

const DeployConfig = require('../jsconfig/DeployConfig');

const DeployUtils = require('../util/DeployUtils');


export const deployCrydrStorage = async (crydrStorageContractArtifact, contractOwner) => {
  global.console.log('\tDeploying storage of a crydr.');

  const contractAddress = await DeployUtils.deployContractAndPersistArtifact(crydrStorageContractArtifact, contractOwner);

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

  await CrydrStorageBaseJSAPI.grantManagerPermissions(crydrStorageAddress, owner, managerGeneral);
  await ManageableJSAPI.enableManager(crydrStorageAddress, owner, managerGeneral);

  global.console.log('\tManagers of crydr storage successfully configured');
  return null;
};
