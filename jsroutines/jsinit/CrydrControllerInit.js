const ManageableJSAPI = require('../../contracts/lifecycle/Manageable/Manageable.jsapi');
const PausableJSAPI = require('../../contracts/lifecycle/Pausable/Pausable.jsapi');
const CrydrControllerBaseJSAPI = require('../../contracts/crydr/controller/CrydrControllerBase/CrydrControllerBase.jsapi');
const CrydrControllerBlockableJSAPI = require('../../contracts/crydr/controller/CrydrControllerBlockable/CrydrControllerBlockable.jsapi');
const CrydrControllerMintableJSAPI = require('../../contracts/crydr/controller/CrydrControllerMintable/CrydrControllerMintable.jsapi');
const CrydrControllerForcedTransferJSAPI = require('../../contracts/crydr/controller/CrydrControllerForcedTransfer/CrydrControllerForcedTransfer.jsapi');
const CrydrControllerLicensedBaseJSAPI = require('../../contracts/crydr/controller/CrydrControllerLicensedBase/CrydrControllerLicensedBase.jsapi');
const JNTControllerJSAPI = require('../../contracts/asset/JNT/JNTController.jsapi');
const JNTPayableServiceInterfaceJSAPI = require('../../contracts/crydr/jnt/JNTPayableService/JNTPayableServiceInterface.jsapi');
const JNTPayableServiceJSAPI = require('../../contracts/crydr/jnt/JNTPayableService/JNTPayableService.jsapi');

const DeployConfig = require('../jsconfig/DeployConfig');

const DeployUtils = require('../util/DeployUtils');


export const deployCrydrController = async (crydrControllerContractArtifact, contractOwner) => {
  global.console.log('\tDeploying controller of a crydr');

  const contractAddress = await DeployUtils.deployContractAndPersistArtifact(crydrControllerContractArtifact, contractOwner);

  global.console.log(`\tController of a crydr successfully deployed: ${contractAddress}`);
  return null;
};

export const configureCrydrControllerManagers = async (crydrControllerAddress) => {
  global.console.log('\tConfiguring managers of crydr controller...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);

  const { owner, managerPause, managerGeneral, managerBlock, managerMint, managerForcedTransfer } = DeployConfig.getAccounts();
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanagerPause - ${managerPause}`);
  global.console.log(`\t\tmanagerGeneral - ${managerGeneral}`);
  global.console.log(`\t\tmanagerBlock - ${managerBlock}`);
  global.console.log(`\t\tmanagerMint - ${managerMint}`);
  global.console.log(`\t\tmanagerForcedTransfer - ${managerForcedTransfer}`);

  await PausableJSAPI.grantManagerPermissions(crydrControllerAddress, owner, managerPause);
  await ManageableJSAPI.enableManager(crydrControllerAddress, owner, managerPause);

  await CrydrControllerBaseJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                         owner, managerGeneral);
  await ManageableJSAPI.enableManager(crydrControllerAddress, owner, managerGeneral);

  await CrydrControllerBlockableJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                              owner, managerBlock);
  await ManageableJSAPI.enableManager(crydrControllerAddress, owner, managerBlock);

  await CrydrControllerMintableJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                             owner, managerMint);
  await ManageableJSAPI.enableManager(crydrControllerAddress, owner, managerMint);

  await CrydrControllerForcedTransferJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                                   owner, managerForcedTransfer);
  await ManageableJSAPI.enableManager(crydrControllerAddress, owner, managerForcedTransfer);

  global.console.log('\tManagers of crydr controller successfully configured');
  return null;
};

export const configureCrydrControllerLicensedManagers = async (crydrControllerAddress) => {
  global.console.log('\tConfiguring managers of licensed crydr controller...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);

  const { owner, managerGeneral } = DeployConfig.getAccounts();
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanagerGeneral - ${managerGeneral}`);

  await CrydrControllerLicensedBaseJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                                 owner, managerGeneral);
  // assumed manager has been enabled already
  // await ManageableJSAPI.enableManager(crydrControllerAddress, owner, managerGeneral);

  global.console.log('\tManagers of licensed crydr controller successfully configured');
  return null;
};

export const configureJntPayableService = async (jntPayableServiceAddress, jntControllerAddress) => {
  global.console.log('\tConfiguring JNT payable service:');
  global.console.log(`\t\tjntPayableServiceAddress - ${jntPayableServiceAddress}`);
  global.console.log(`\t\tjntControllerAddress - ${jntControllerAddress}`);

  const { owner, managerJNT, jntBeneficiary } = DeployConfig.getAccounts();
  global.console.log(`\t\towner - ${owner}`);

  await JNTPayableServiceJSAPI.grantManagerPermissions(jntPayableServiceAddress, owner, managerJNT);
  await ManageableJSAPI.enableManager(jntPayableServiceAddress, owner, managerJNT);

  await JNTPayableServiceInterfaceJSAPI.setJntController(jntPayableServiceAddress, managerJNT, jntControllerAddress);
  await JNTPayableServiceInterfaceJSAPI.setJntBeneficiary(jntPayableServiceAddress, managerJNT, jntBeneficiary);

  await JNTControllerJSAPI.grantManagerPermissions(jntControllerAddress, owner, jntPayableServiceAddress);
  await ManageableJSAPI.enableManager(jntControllerAddress, owner, jntPayableServiceAddress);

  global.console.log('\tJNT payable service successfully configured');
  return null;
};
