const PausableJSAPI = require('../../jsapi/lifecycle/Pausable');
const CrydrStorageBaseInterfaceJSAPI = require('../../jsapi/crydr/storage/CrydrStorageBaseInterface');
const CrydrControllerBaseInterfaceJSAPI = require('../../jsapi/crydr/controller/CrydrControllerBaseInterface');
const CrydrViewBaseInterfaceJSAPI = require('../../jsapi/crydr/view/CrydrViewBaseInterface');

const CrydrStorageInitJSAPI = require('./CrydrStorageInit');
const CrydrControllerInitJSAPI = require('./CrydrControllerInit');
const CrydrViewInitJSAPI = require('./CrydrViewInit');
const GlobalConfig = require('./GlobalConfig');


export const deployCrydrContracts = async (crydrStorageContractArtifact,
                                           crydrControllerContractArtifact,
                                           crydrViewContractArtifact) => {
  global.console.log('\tDeploying crydr contracts');

  await CrydrStorageInitJSAPI.deployCrydrStorage(crydrStorageContractArtifact);
  await CrydrControllerInitJSAPI.deployCrydrController(crydrControllerContractArtifact);
  await CrydrViewInitJSAPI.deployCrydrView(crydrViewContractArtifact);

  global.console.log('\tCrydr contracts successfully deployed');
  return null;
};

export const configureCrydrManagers = async (crydrStorageAddress, crydrControllerAddress, crydrViewAddress) => {
  global.console.log('\tConfiguring managers of crydr contracts...');
  global.console.log(`\t\tcrydrStorageAddress - ${crydrStorageAddress}`);
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);

  await CrydrStorageInitJSAPI.configureCrydrStorageManagers(crydrStorageAddress);
  await CrydrControllerInitJSAPI.configureCrydrControllerManagers(crydrControllerAddress);
  await CrydrViewInitJSAPI.configureCrydrViewManagers(crydrViewAddress);

  global.console.log('\tManagers of crydr contracts successfully configured');
  return null;
};

export const linkCrydrStorage = async (crydrStorageAddress,
                                       crydrControllerAddress) => {
  global.console.log('\tLink crydr storage to controller...');
  global.console.log(`\t\tcrydrStorageAddress - ${crydrStorageAddress}`);
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);

  const { managerGeneral } = GlobalConfig.getAccounts();
  global.console.log(`\t\towner - ${managerGeneral}`);

  await CrydrStorageBaseInterfaceJSAPI
    .setCrydrController(crydrStorageAddress, managerGeneral, crydrControllerAddress);
  await CrydrControllerBaseInterfaceJSAPI
    .setCrydrStorage(crydrControllerAddress, managerGeneral, crydrStorageAddress);

  global.console.log('\tCrydr storage successfully linked');
  return null;
};

export const linkCrydrView = async (crydrControllerAddress,
                                    crydrViewAddress,
                                    crydrViewApiStandardName) => {
  global.console.log('\tLink crydr view to controller...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tcrydrViewApiStandardName - ${crydrViewApiStandardName}`);

  const { managerGeneral } = GlobalConfig.getAccounts();
  global.console.log(`\t\tmanagerGeneral - ${managerGeneral}`);

  await CrydrViewBaseInterfaceJSAPI
    .setCrydrController(crydrViewAddress, managerGeneral, crydrControllerAddress);
  await CrydrControllerBaseInterfaceJSAPI
    .setCrydrView(crydrControllerAddress, managerGeneral, crydrViewAddress, crydrViewApiStandardName);

  global.console.log('\tCrydr view successfully linked');
  return null;
};

export const configureCrydr = async (crydrStorageAddress,
                                     crydrControllerAddress,
                                     crydrViewAddress,
                                     crydrViewApiStandardName) => {
  global.console.log('\tConfigure JCash crydr...');
  global.console.log(`\t\tcrydrStorageAddress - ${crydrStorageAddress}`);
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tcrydrViewApiStandardName - ${crydrViewApiStandardName}`);

  await configureCrydrManagers(crydrStorageAddress, crydrControllerAddress, crydrViewAddress);
  await linkCrydrStorage(crydrStorageAddress, crydrControllerAddress);
  await linkCrydrView(crydrControllerAddress, crydrViewAddress, crydrViewApiStandardName);

  global.console.log('\tJCash crydr successfully configured');
  return null;
};


export const initCrydr = async (crydrStorageContractArtifact,
                                crydrControllerContractArtifact,
                                crydrViewContractArtifact,
                                crydrViewApiStandardName) => {
  global.console.log('\tDeploy and init JCash crydr...');
  global.console.log(`\t\tcrydrViewApiStandardName - ${crydrViewApiStandardName}`);

  await deployCrydrContracts(crydrStorageContractArtifact,
                             crydrControllerContractArtifact,
                             crydrViewContractArtifact);

  const crydrStorageInstance = await crydrStorageContractArtifact.deployed();
  const crydrStorageAddress = crydrStorageInstance.address;
  const crydrControllerInstance = await crydrControllerContractArtifact.deployed();
  const crydrControllerAddress = crydrControllerInstance.address;
  const crydrViewInstance = await crydrViewContractArtifact.deployed();
  const crydrViewAddress = crydrViewInstance.address;

  await configureCrydr(crydrStorageAddress,
                       crydrControllerAddress,
                       crydrViewAddress,
                       crydrViewApiStandardName);

  global.console.log('\tJCash crydr successfully initialized');
  return null;
};


export const upauseCrydrControllerAndStorage = async (crydrStorageContractArtifact,
                                      crydrControllerContractArtifact) => {
  global.console.log('\tUnpause controller and storage of JCash crydr...');

  const { managerPause } = GlobalConfig.getAccounts();
  global.console.log(`\t\tmanagerPause - ${managerPause}`);

  const crydrStorageInstance = await crydrStorageContractArtifact.deployed();
  const crydrStorageAddress = crydrStorageInstance.address;
  const crydrControllerInstance = await crydrControllerContractArtifact.deployed();
  const crydrControllerAddress = crydrControllerInstance.address;

  await PausableJSAPI.unpauseContract(crydrStorageAddress, managerPause);
  await PausableJSAPI.unpauseContract(crydrControllerAddress, managerPause);

  global.console.log('\tController and storage of JCash crydr successfully unpaused');
  return null;
};

export const upauseCrydrView = async (crydrViewContractArtifact) => {
  global.console.log('\tUnpause view of JCash crydr...');

  const { managerPause } = GlobalConfig.getAccounts();
  global.console.log(`\t\tmanagerPause - ${managerPause}`);

  const crydrViewInstance = await crydrViewContractArtifact.deployed();
  const crydrViewAddress = crydrViewInstance.address;

  await PausableJSAPI.unpauseContract(crydrViewAddress, managerPause);

  global.console.log('\tView of JCash crydr successfully unpaused');
  return null;
};

