const ManageableJSAPI = require('../jsapi/lifecycle/Manageable');
const PausableJSAPI = require('../jsapi/lifecycle/Pausable');
const CrydrControllerBaseInterfaceJSAPI = require('../jsapi/crydr/controller/CrydrControllerBaseInterface');
const CrydrControllerBlockableInterfaceJSAPI = require('../jsapi/crydr/controller/CrydrControllerBlockableInterface');
const CrydrControllerMintableInterfaceJSAPI = require('../jsapi/crydr/controller/CrydrControllerMintableInterface');
const JNTControllerInterfaceJSAPI = require('../jsapi/crydr/jnt/JNTControllerInterface');
const JNTPayableServiceInterfaceJSAPI = require('../jsapi/crydr/jnt/JNTPayableServiceInterface');

const GlobalConfig = require('./GlobalConfig');


export const deployCrydrController = async (crydrControllerContractArtifact) => {
  global.console.log('\tDeploying controller of a crydr');

  const deployer = GlobalConfig.getDeployer();
  const { owner } = GlobalConfig.getAccounts();
  global.console.log(`\t\towner - ${owner}`);

  await deployer.deploy(crydrControllerContractArtifact, { from: owner });

  const crydrControllerContractInstance = await crydrControllerContractArtifact.deployed();
  const crydrControllerContractAddress = crydrControllerContractInstance.address;

  global.console.log(`\tController of a crydr successfully deployed: ${crydrControllerContractAddress}`);
  return null;
};

export const configureCrydrControllerManagers = async (crydrControllerAddress) => {
  global.console.log('\tConfiguring managers of crydr controller...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);

  const { owner, managerPause, managerGeneral, managerBlock, managerMint } = GlobalConfig.getAccounts();
  global.console.log(`\t\towner - ${owner}`);
  global.console.log(`\t\tmanagerPause - ${managerPause}`);
  global.console.log(`\t\tmanagerGeneral - ${managerGeneral}`);
  global.console.log(`\t\tmanagerBlock - ${managerBlock}`);
  global.console.log(`\t\tmanagerMint - ${managerMint}`);

  await PausableJSAPI.grantManagerPermissions(crydrControllerAddress, owner, managerPause);
  await ManageableJSAPI.enableManager(crydrControllerAddress, owner, managerPause);

  await CrydrControllerBaseInterfaceJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                                  owner, managerGeneral);
  await ManageableJSAPI.enableManager(crydrControllerAddress, owner, managerGeneral);

  await CrydrControllerBlockableInterfaceJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                                       owner, managerBlock);
  await ManageableJSAPI.enableManager(crydrControllerAddress, owner, managerBlock);

  await CrydrControllerMintableInterfaceJSAPI.grantManagerPermissions(crydrControllerAddress,
                                                                      owner, managerMint);
  await ManageableJSAPI.enableManager(crydrControllerAddress, owner, managerMint);

  global.console.log('\tManagers of crydr controller successfully configured');
  return null;
};

export const configureJntPayableService = async (jntPayableServiceAddress, jntControllerAddress) => {
  global.console.log('\tConfiguring JNT payable service:');
  global.console.log(`\t\tjntPayableServiceAddress - ${jntPayableServiceAddress}`);
  global.console.log(`\t\tjntControllerAddress - ${jntControllerAddress}`);

  const { owner, managerJNT, jntBeneficiary } = GlobalConfig.getAccounts();
  global.console.log(`\t\towner - ${owner}`);

  await JNTPayableServiceInterfaceJSAPI.grantManagerPermissions(jntPayableServiceAddress, owner, managerJNT);
  await ManageableJSAPI.enableManager(jntPayableServiceAddress, owner, managerJNT);

  await JNTPayableServiceInterfaceJSAPI.setJntController(jntPayableServiceAddress, managerJNT, jntControllerAddress);
  await JNTPayableServiceInterfaceJSAPI.setJntBeneficiary(jntPayableServiceAddress, managerJNT, jntBeneficiary);

  await JNTControllerInterfaceJSAPI.grantManagerPermissions(jntControllerAddress, owner, jntPayableServiceAddress);
  await ManageableJSAPI.enableManager(jntControllerAddress, owner, jntPayableServiceAddress);

  global.console.log('\tJNT payable service successfully configured');
  return null;
};
