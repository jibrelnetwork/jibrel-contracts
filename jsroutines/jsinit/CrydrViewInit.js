const ManageableJSAPI = require('../../contracts/lifecycle/Manageable/Manageable.jsapi');
const PausableJSAPI = require('../../contracts/lifecycle/Pausable/Pausable.jsapi');
const CrydrViewBaseJSAPI = require('../../contracts/crydr/view/CrydrViewBase/CrydrViewBase.jsapi');
const CrydrViewERC20NamedJSAPI = require('../../contracts/crydr/view/CrydrViewERC20Named/CrydrViewERC20Named.jsapi');
const CrydrViewMetadataJSAPI = require('../../contracts/crydr/view/CrydrViewMetadata/CrydrViewMetadata.jsapi');

const DeployConfig = require('../jsconfig/DeployConfig');

const DeployUtils = require('../util/DeployUtils');


export const deployCrydrView = async (crydrViewContractArtifact, contractOwner) => {
  global.console.log('\tDeploying view of a crydr.');

  const contractAddress = await DeployUtils.deployContractAndPersistArtifact(crydrViewContractArtifact, contractOwner);

  global.console.log(`\tView of a crydr successfully deployed: ${contractAddress}`);
  return null;
};

export const configureCrydrViewManagers = async (crydrViewAddress) => {
  global.console.log('\tConfiguring managers of crydr view...');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);

  const { owner, managerPause, managerGeneral } = DeployConfig.getAccounts();
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanagerPause - ${managerPause}`);
  global.console.log(`\t\tmanagerGeneral - ${managerGeneral}`);

  await PausableJSAPI.grantManagerPermissions(crydrViewAddress, owner, managerPause);
  await ManageableJSAPI.enableManager(crydrViewAddress, owner, managerPause);

  await CrydrViewBaseJSAPI.grantManagerPermissions(crydrViewAddress, owner, managerGeneral);
  await CrydrViewERC20NamedJSAPI.grantManagerPermissions(crydrViewAddress, owner, managerGeneral);
  await ManageableJSAPI.enableManager(crydrViewAddress, owner, managerGeneral);

  global.console.log('\tManagers of crydr view successfully configured');
  return null;
};

export const configureCrydrViewMetadataManagers = async (crydrViewAddress) => {
  global.console.log('\tConfiguring managers of crydr view with metadata...');
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);

  const { owner, managerGeneral } = DeployConfig.getAccounts();
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanagerGeneral - ${managerGeneral}`);

  await CrydrViewMetadataJSAPI.grantManagerPermissions(crydrViewAddress,
                                                       owner, managerGeneral);
  // assumed manager has been enabled already
  // await ManageableJSAPI.enableManager(crydrControllerAddress, owner, managerGeneral);

  global.console.log('\tManagers of crydr view with metadata successfully configured');
  return null;
};
