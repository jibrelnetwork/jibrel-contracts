const ManageableJSAPI = require('../../contracts/lifecycle/Manageable/Manageable.jsapi');
const PausableJSAPI = require('../../contracts/lifecycle/Pausable/Pausable.jsapi');
const CrydrLicenseRegistryManagementJSAPI = require('../../contracts/crydr/license/CrydrLicenseRegistry.jsapi');

const DeployConfig = require('../jsconfig/DeployConfig');

const DeployUtils = require('../util/DeployUtils');


export const deployLicenseRegistry = async (licenseRegistryArtifact, contractOwner) => {
  global.console.log('\tDeploying license registry of a crydr.');

  const contractAddress = await DeployUtils.deployContractAndPersistArtifact(licenseRegistryArtifact, contractOwner);

  global.console.log(`\tLicense registry of a crydr successfully deployed: ${contractAddress}`);

  return null;
};

export const configureLicenseRegistryManagers = async (licenseRegistryAddress) => {
  global.console.log('\tConfiguring managers of license registry...');
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);

  const { owner, managerPause, managerLicense } = DeployConfig.getAccounts();
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanagerPause - ${managerPause}`);
  global.console.log(`\t\tmanagerLicense - ${managerLicense}`);

  await PausableJSAPI.grantManagerPermissions(licenseRegistryAddress, owner, managerPause);
  await ManageableJSAPI.enableManager(licenseRegistryAddress, owner, managerPause);

  await CrydrLicenseRegistryManagementJSAPI.grantManagerPermissions(licenseRegistryAddress, owner, managerLicense);
  await ManageableJSAPI.enableManager(licenseRegistryAddress, owner, managerLicense);

  global.console.log('\tManagers of license registry successfully configured');
  return null;
};
