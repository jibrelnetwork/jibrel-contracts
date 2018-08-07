const PausableJSAPI = require('../../contracts/lifecycle/Pausable/PausableInterface.jsapi');
const CrydrStorageBaseInterfaceJSAPI = require('../../contracts/crydr/storage/CrydrStorageBase/CrydrStorageBaseInterface.jsapi');
const CrydrControllerBaseInterfaceJSAPI = require('../../contracts/crydr/controller/CrydrControllerBase/CrydrControllerBaseInterface.jsapi');
const CrydrControllerLicensedBaseInterfaceJSAPI = require('../../contracts/crydr/controller/CrydrControllerLicensedBase/CrydrControllerLicensedBaseInterface.jsapi');
const CrydrViewBaseInterfaceJSAPI = require('../../contracts/crydr/view/CrydrViewBase/CrydrViewBaseInterface.jsapi');

const DeployConfig = require('../jsconfig/DeployConfig');

const CrydrStorageInitJSAPI = require('./CrydrStorageInit');
const CrydrLicenseRegistryInitJSAPI = require('./CrydrLicenseRegistryInit');
const CrydrControllerInitJSAPI = require('./CrydrControllerInit');
const CrydrViewInitJSAPI = require('./CrydrViewInit');


export const linkCrydrStorage = async (crydrStorageAddress,
                                       crydrControllerAddress) => {
  global.console.log('\tLink crydr storage to controller...');
  global.console.log(`\t\tcrydrStorageAddress - ${crydrStorageAddress}`);
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);

  const { managerGeneral } = DeployConfig.getAccounts();
  global.console.log(`\t\tmanagerGeneral - ${managerGeneral}`);

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

  const { managerGeneral } = DeployConfig.getAccounts();
  global.console.log(`\t\tmanagerGeneral - ${managerGeneral}`);

  await CrydrViewBaseInterfaceJSAPI
    .setCrydrController(crydrViewAddress, managerGeneral, crydrControllerAddress);
  await CrydrControllerBaseInterfaceJSAPI
    .setCrydrView(crydrControllerAddress, managerGeneral, crydrViewAddress, crydrViewApiStandardName);

  global.console.log('\tCrydr view successfully linked');
  return null;
};

export const linkLicenseRegistry = async (licenseRegistryAddress,
                                          crydrControllerAddress) => {
  global.console.log('\tLink license registry and controller...');
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);

  const { managerGeneral } = DeployConfig.getAccounts();
  global.console.log(`\t\tmanagerLicense - ${managerGeneral}`);

  await CrydrControllerLicensedBaseInterfaceJSAPI
    .setLicenseRegistry(crydrControllerAddress, managerGeneral, licenseRegistryAddress);

  global.console.log('\tLicense registry and controller successfully linked');
  return null;
};


export const initCrydr = async (crydrStorageContractArtifact,
                                crydrControllerContractArtifact,
                                crydrViewContractArtifact,
                                crydrViewApiStandardName) => {
  global.console.log('\tDeploy and init JCash crydr...');
  global.console.log(`\t\tcrydrViewApiStandardName - ${crydrViewApiStandardName}`);

  global.console.log('\tDeploying crydr contracts');
  const { owner } = DeployConfig.getAccounts();
  await CrydrStorageInitJSAPI.deployCrydrStorage(crydrStorageContractArtifact, owner);
  await CrydrControllerInitJSAPI.deployCrydrController(crydrControllerContractArtifact, owner);
  await CrydrViewInitJSAPI.deployCrydrView(crydrViewContractArtifact, owner);
  global.console.log('\tCrydr contracts successfully deployed');

  const crydrStorageInstance = await crydrStorageContractArtifact.deployed();
  const crydrStorageAddress = crydrStorageInstance.address;
  const crydrControllerInstance = await crydrControllerContractArtifact.deployed();
  const crydrControllerAddress = crydrControllerInstance.address;
  const crydrViewInstance = await crydrViewContractArtifact.deployed();
  const crydrViewAddress = crydrViewInstance.address;

  global.console.log('\tConfiguring crydr managers');
  await CrydrStorageInitJSAPI.configureCrydrStorageManagers(crydrStorageAddress);
  await CrydrControllerInitJSAPI.configureCrydrControllerManagers(crydrControllerAddress);
  await CrydrViewInitJSAPI.configureCrydrViewManagers(crydrViewAddress);
  global.console.log('\tCrydr managers successfully configured');

  global.console.log('\tLink crydr contracts');
  await linkCrydrStorage(crydrStorageAddress, crydrControllerAddress);
  await linkCrydrView(crydrControllerAddress, crydrViewAddress, crydrViewApiStandardName);
  global.console.log('\tCrydr contracts successfully linked');

  global.console.log('\tJCash crydr successfully initialized');
  return null;
};

export const initLicensedCrydr = async (crydrStorageContractArtifact,
                                        licenseRegistryArtifact,
                                        crydrControllerContractArtifact,
                                        crydrViewContractArtifact,
                                        crydrViewApiStandardName) => {
  global.console.log('\tDeploy and init licensed JCash crydr...');

  await initCrydr(crydrStorageContractArtifact,
                  crydrControllerContractArtifact,
                  crydrViewContractArtifact,
                  crydrViewApiStandardName);

  global.console.log('\tDeploying license registry contract');
  const { owner } = DeployConfig.getAccounts();
  await CrydrLicenseRegistryInitJSAPI.deployLicenseRegistry(licenseRegistryArtifact, owner);
  global.console.log('\tLicense registry successfully deployed');

  const licenseRegistryInstance = await licenseRegistryArtifact.deployed();
  const licenseRegistryAddress = licenseRegistryInstance.address;
  const crydrViewInstance = await crydrViewContractArtifact.deployed();
  const crydrViewAddress = crydrViewInstance.address;
  const crydrControllerInstance = await crydrControllerContractArtifact.deployed();
  const crydrControllerAddress = crydrControllerInstance.address;

  global.console.log('\tConfiguring license managers');
  await CrydrLicenseRegistryInitJSAPI.configureLicenseRegistryManagers(licenseRegistryAddress);
  await CrydrControllerInitJSAPI.configureCrydrControllerLicensedManagers(crydrControllerAddress);
  global.console.log('\tLicense managers successfully configured');

  global.console.log('\tLink license registry and controller');
  await linkLicenseRegistry(licenseRegistryAddress, crydrControllerAddress);
  global.console.log('\tLicense registry and controller successfully linked');

  global.console.log('\tLicensed JCash crydr successfully initialized');
  return null;
};


export const upauseCrydrContract = async (crydrContractArtifact, contractType) => {
  global.console.log(`\tUnpause ${contractType} of JCash crydr...`);

  const { managerPause } = DeployConfig.getAccounts();
  global.console.log(`\t\tmanagerPause - ${managerPause}`);

  const crydrContractInstance = await crydrContractArtifact.deployed();
  const crydrContractAddress = crydrContractInstance.address;

  await PausableJSAPI.unpauseContract(crydrContractAddress, managerPause);

  global.console.log(`\t${contractType} of JCash crydr successfully unpaused`);
  return null;
};
